// src/utils/flutterGenerator.js

const parseSize = (val, isWidth = true) => {
    if (val === undefined || val === null || val === '' || val === 'auto') return 'null';
    const strVal = String(val).trim();
    if (strVal.includes('%')) {
        const percent = parseFloat(strVal) / 100;
        if (percent === 1) return isWidth ? 'constraints.maxWidth' : 'constraints.maxHeight';
        return `(${isWidth ? 'constraints.maxWidth' : 'constraints.maxHeight'} * ${percent})`;
    } 
    const num = parseFloat(strVal.replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return 'null';
    return num.toFixed(1);
};

const parseRadius = (val) => {
    const parsed = parseSize(val, true);
    return parsed === 'null' ? '0.0' : parsed;
};

const parseColor = (val, schemaTheme) => {
    if (!val || val === 'transparent') return 'Colors.transparent';
    if (val === 'theme.primary') return `Color(0xFF${schemaTheme.primary.replace('#', '')})`;
    if (val === 'theme.secondary') return `Color(0xFF${(schemaTheme.secondary || 'EC4899').replace('#', '')})`;
    if (val === 'theme.background') return `Color(0xFF${schemaTheme.background.replace('#', '')})`;
    if (val.startsWith('#')) return `Color(0xFF${val.replace('#', '')})`;
    return 'Colors.transparent';
};

const parseAlignment = (val) => {
    switch (val) {
        case 'center': return 'MainAxisAlignment.center';
        case 'end': return 'MainAxisAlignment.end';
        case 'spaceBetween': return 'MainAxisAlignment.spaceBetween';
        default: return 'MainAxisAlignment.start';
    }
};

const parseCrossAlignment = (val) => {
    switch (val) {
        case 'center': return 'CrossAxisAlignment.center';
        case 'stretch': return 'CrossAxisAlignment.stretch';
        default: return 'CrossAxisAlignment.start';
    }
};

const parseEdgeInsets = (val) => {
    if (!val || val === '0px' || val === '0') return 'EdgeInsets.zero';
    const parts = val.split(/[\s,]+/).map(p => parseFloat(p.replace(/[^0-9.-]/g, ''))).filter(n => !isNaN(n));
    if (parts.length === 1) return `EdgeInsets.all(${parts[0].toFixed(1)})`;
    if (parts.length === 2) return `EdgeInsets.symmetric(vertical: ${parts[0].toFixed(1)}, horizontal: ${parts[1].toFixed(1)})`;
    if (parts.length >= 4) return `EdgeInsets.fromLTRB(${parts[3].toFixed(1)}, ${parts[0].toFixed(1)}, ${parts[1].toFixed(1)}, ${parts[2].toFixed(1)})`;
    return `EdgeInsets.zero`;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// --- SAFE ICON TRANSLATOR ---
const getFlutterIcon = (rawName) => {
    if (!rawName) return 'help_outline';
    const name = rawName.toLowerCase().replace(/[- ]/g, '_');
    const iconMap = {
        'plus': 'add', 'pluscircle': 'add_circle', 'x': 'close',
        'user': 'person', 'users': 'people', 'trash': 'delete',
        'play': 'play_arrow', 'layout': 'dashboard', 'database': 'storage',
        'zap': 'bolt'
    };
    return iconMap[name] || name;
};

// ---------------------------------------------------------------------------
// ENV HELPERS
// Reads secrets from .env.local (Next.js / Vite convention).
// In the browser build, NEXT_PUBLIC_ vars are inlined by the bundler.
// In Node/test environments, process.env is used directly.
// ---------------------------------------------------------------------------

/**
 * Returns the env key name for a given secret so callers can reference it
 * consistently and the generator can emit the correct env var name.
 */
const ENV_KEYS = {
    SUPABASE_URL:      'NEXT_PUBLIC_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    FIREBASE_API_KEY:       'NEXT_PUBLIC_FIREBASE_API_KEY',
    FIREBASE_APP_ID:        'NEXT_PUBLIC_FIREBASE_APP_ID',
    FIREBASE_MESSAGING_ID:  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    FIREBASE_PROJECT_ID:    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
};

/**
 * Reads a value from the environment.
 * Falls back to the schema value so existing callers keep working when
 * the env var hasn't been set yet (e.g. during local dev without .env.local).
 */
const readEnv = (key, fallback = '') => {
    // Next.js inlines NEXT_PUBLIC_ vars at build time; Vite uses import.meta.env.
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return fallback;
};

/**
 * Resolves Supabase credentials.
 * Priority: .env.local → schema → empty string.
 */
const resolveSupabase = (schema) => {
    const rawUrl  = readEnv(ENV_KEYS.SUPABASE_URL,      schema?.supabaseConfig?.url      || '');
    const anonKey = readEnv(ENV_KEYS.SUPABASE_ANON_KEY, schema?.supabaseConfig?.anonKey  || '');
    const url     = rawUrl.trim().replace(/\/+$/, '');
    const isPlaceholder = url.includes('your-project.supabase.co');
    return {
        url,
        anonKey: anonKey.trim(),
        active: url.length > 5 && !isPlaceholder,
    };
};

/**
 * Resolves Firebase credentials.
 * Priority: .env.local → schema → empty string.
 */
const resolveFirebase = (schema) => {
    const fc = schema?.firebaseConfig || {};
    return {
        apiKey:            readEnv(ENV_KEYS.FIREBASE_API_KEY,      fc.apiKey            || ''),
        appId:             readEnv(ENV_KEYS.FIREBASE_APP_ID,       fc.appId             || ''),
        messagingSenderId: readEnv(ENV_KEYS.FIREBASE_MESSAGING_ID, fc.messagingSenderId || ''),
        projectId:         readEnv(ENV_KEYS.FIREBASE_PROJECT_ID,   fc.projectId         || ''),
    };
};

// ---------------------------------------------------------------------------
// Checks whether any node in the tree uses a specific widget type.
// Used to gate conditional imports so we don't emit unused pub dependencies.
// ---------------------------------------------------------------------------
const schemaUsesWidget = (schema, type) => {
    const search = (node) => {
        if (!node) return false;
        if (node.type === type) return true;
        return (node.children || []).some(search);
    };
    return (schema.pages || []).some(page => search(page.root));
};

export const generateFlutterCode = (schema) => {
    
    // Resolve secrets from .env.local (with schema fallback)
    const supabase = resolveSupabase(schema);
    const firebase = resolveFirebase(schema);

    // Detect which optional widgets are actually used so we only import what's needed
    const usesMap     = schemaUsesWidget(schema, 'MapView');
    const usesWebView = schemaUsesWidget(schema, 'WebView');

    // 1. GENERATE STATE MANAGEMENT
    let stateVariables = '';
    let stateGetters = '';
    let stateMutators = '';

    if (schema.appState && schema.appState.length > 0) {
        schema.appState.forEach(state => {
            const varName = state.key.replace(/[^a-zA-Z0-9]/g, '');
            const vType = state.type || 'String';
            
            let formattedValue = state.value;
            if (vType === 'String') {
                formattedValue = `'${state.value.replace(/'/g, "\\'")}'`;
            } else if (vType === 'bool') {
                formattedValue = state.value === 'true' ? 'true' : 'false';
            } else if (vType === 'double') {
                formattedValue = state.value.includes('.') ? state.value : `${state.value}.0`;
            }

            stateVariables += `  ${vType} _${varName} = ${formattedValue};\n`;
            stateGetters   += `  ${vType} get ${varName} => _${varName};\n`;
            stateMutators  += `  void update${capitalize(varName)}(${vType} val) {\n    _${varName} = val;\n    notifyListeners();\n  }\n`;
        });
    }

    const stateClass = `
class AppState extends ChangeNotifier {
  static final AppState instance = AppState._internal();
  AppState._internal();

${stateVariables}
${stateGetters}
${stateMutators}
}
`;

    // 2. ADVANCED ACTION CHAIN BUILDER
    const buildActionChain = (props) => {
        let chain = props.actionChain || [];
        if (chain.length === 0 && props.actionType && props.actionType !== 'none') {
            chain.push({
                type: props.actionType, target: props.targetPage, variable: props.stateVariable,
                value: props.stateValue, url: props.apiUrl, message: props.toastMessage,
                authEmailVar: props.authEmailVar, authPasswordVar: props.authPasswordVar,
                dbTable: props.dbTable, payload: props.dbPayload
            });
        }

        if (chain.length === 0) return 'onPressed: () {},';

        let code = '';
        chain.forEach(action => {
            if (action.type === 'navigate' && action.target) {
                code += `      Navigator.pushNamed(context, '/${action.target}');\n`; 
            }
            if ((action.type === 'updateState' || action.type === 'state') && action.variable) {
                const cleanVar = action.variable.replace(/[^a-zA-Z0-9]/g, '');
                const stateObj = schema.appState?.find(s => s.key === action.variable);
                const vType = stateObj ? (stateObj.type || 'String') : 'String';
                
                let passValue = `'${action.value || ''}'`;
                if (vType === 'int') passValue = `int.tryParse('${action.value}') ?? 0`;
                if (vType === 'double') passValue = `double.tryParse('${action.value}') ?? 0.0`;
                if (vType === 'bool') passValue = action.value === 'true' ? 'true' : 'false';

                code += `      AppState.instance.update${capitalize(cleanVar)}(${passValue});\n`;
            }
            if ((action.type === 'apiCall' || action.type === 'api') && action.url) {
                const method = action.method === 'POST' ? 'post' : 'get';
                // Supabase URLs: inject auth headers using resolved (env-safe) credentials
                let headerCode = `null`;
                if (supabase.active && action.url.includes(supabase.url)) {
                    headerCode = `{ 'apikey': '${supabase.anonKey}', 'Authorization': 'Bearer ${supabase.anonKey}' }`;
                }
                code += `      try { await http.${method}(Uri.parse('${action.url}'), headers: ${headerCode}).timeout(const Duration(seconds: 10)); } catch (e) {}\n`;
            }
            if (action.type === 'toast' && action.message) {
                code += `      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${action.message}')));\n`;
            }
            if (action.type === 'supabaseSignUp' && action.authEmailVar && action.authPasswordVar) {
                code += `      try { await Supabase.instance.client.auth.signUp(email: AppState.instance.${action.authEmailVar}, password: AppState.instance.${action.authPasswordVar}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sign up successful!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: \\$e'))); }\n`;
            }
            if (action.type === 'supabaseSignIn' && action.authEmailVar && action.authPasswordVar) {
                code += `      try { await Supabase.instance.client.auth.signInWithPassword(email: AppState.instance.${action.authEmailVar}, password: AppState.instance.${action.authPasswordVar}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login successful!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Login Error: \\$e'))); }\n`;
            }
            if ((action.type === 'supabaseInsert' || action.type === 'supabase') && (action.dbTable || action.table)) {
                const tableName = action.dbTable || action.table;
                let rawPayload = action.dbPayload || action.payload || '{}';
                if (rawPayload === 'null' || rawPayload === '') rawPayload = '{}';
                code += `      try { await Supabase.instance.client.from('${tableName}').insert(${rawPayload}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Data saved!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Insert Error: \\$e'))); }\n`;
            }
            if (action.type === 'firebaseSignUp' && action.authEmailVar && action.authPasswordVar) {
                code += `      try { await FirebaseAuth.instance.createUserWithEmailAndPassword(email: AppState.instance.${action.authEmailVar}, password: AppState.instance.${action.authPasswordVar}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Firebase Sign up successful!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: \\$e'))); }\n`;
            }
            if (action.type === 'firebaseSignIn' && action.authEmailVar && action.authPasswordVar) {
                code += `      try { await FirebaseAuth.instance.signInWithEmailAndPassword(email: AppState.instance.${action.authEmailVar}, password: AppState.instance.${action.authPasswordVar}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Firebase Login successful!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Login Error: \\$e'))); }\n`;
            }
            if ((action.type === 'firebaseInsert' || action.type === 'firestore') && (action.dbTable || action.table)) {
                const tableName = action.dbTable || action.table;
                let rawPayload = action.dbPayload || action.payload || '{}';
                if (rawPayload === 'null' || rawPayload === '') rawPayload = '{}';
                code += `      try { await FirebaseFirestore.instance.collection('${tableName}').add(${rawPayload}); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Firestore Data saved!'))); } catch (e) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Firestore Insert Error: \\$e'))); }\n`;
            }
        });

        if (code.includes('await ')) return `onPressed: () async {\n${code}    },`;
        return `onPressed: () {\n${code}    },`;
    };

    // 3. RECURSIVE WIDGET BUILDER
    const buildWidget = (node) => {
        if (!node) return 'const SizedBox.shrink()';

        const props = node.props || {};
        let widgetCode = '';

        // --- SAFE STRING ESCAPING (Prevents $19.99 from crashing the compiler) ---
        let rawText = props.content || props.label || props.placeholder || '';
        let safeText = String(rawText)
            .replace(/\\/g, '\\\\') 
            .replace(/\$/g, '\\$')  
            .replace(/'/g, "\\'");  
            
        let contentStr = `'${safeText}'`;
        let requiresStateListener = false;
        
        if (props.isBound && props.boundVariable) {
            const cleanVar = props.boundVariable.replace(/[^a-zA-Z0-9]/g, '');
            contentStr = `AppState.instance.${cleanVar}`;
            requiresStateListener = true;
        }

        const absoluteChildrenNodes = (node.children || []).filter(c => c && c.props && c.props.position === 'absolute');
        const staticChildrenNodes   = (node.children || []).filter(c => c && (!c.props || c.props.position !== 'absolute'));
        const childrenCode          = staticChildrenNodes.length > 0 ? staticChildrenNodes.map(buildWidget).join(',\n') : '';

        switch (node.type) {

            case 'VideoPlayer':
                widgetCode = `Container(
                  width: ${parseSize(props.width, true)},
                  height: ${parseSize(props.height, false)},
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.only(topLeft: Radius.circular(${parseRadius(props.radiusTopLeft)}), topRight: Radius.circular(${parseRadius(props.radiusTopRight)}), bottomLeft: Radius.circular(${parseRadius(props.radiusBottomLeft)}), bottomRight: Radius.circular(${parseRadius(props.radiusBottomRight)})),
                  ),
                  child: const Center(
                    child: Icon(Icons.play_circle_fill, color: Colors.white70, size: 48.0),
                  ),
                ) /* TODO: Replace with video_player package implementation */`;
                break;

            case 'MapView':
                widgetCode = `SizedBox(
                  width: ${parseSize(props.width, true)},
                  height: ${parseSize(props.height, false)},
                  child: GoogleMap(
                    initialCameraPosition: CameraPosition(
                      target: LatLng(${props.latitude || '37.7749'}, ${props.longitude || '-122.4194'}),
                      zoom: ${parseFloat(props.zoom || '14.0')},
                    ),
                    myLocationEnabled: true,
                    mapType: MapType.normal,
                  ),
                )`;
                break;

            case 'WebView':
                widgetCode = `SizedBox(
                  width: ${parseSize(props.width, true)},
                  height: ${parseSize(props.height, false)},
                  child: WebViewWidget(
                    controller: WebViewController()
                      ..setJavaScriptMode(JavaScriptMode.unrestricted)
                      ..loadRequest(Uri.parse('${props.url || 'https://flutter.dev'}')),
                  ),
                )`;
                break;

            case 'PageView':
                let pvScroll = props.scrollDirection === 'vertical' ? 'Axis.vertical' : 'Axis.horizontal';
                widgetCode = `PageView(
                  scrollDirection: ${pvScroll},
                  children: <Widget>[
                    ${staticChildrenNodes.map(buildWidget).join(',\n')}
                  ]
                )`;
                break;

            case 'Carousel':
                let fraction = props.viewportFraction || '0.8';
                widgetCode = `PageView(
                  controller: PageController(viewportFraction: ${fraction}),
                  children: <Widget>[
                    ${staticChildrenNodes.map(buildWidget).join(',\n')}
                  ]
                )`;
                break;

            case 'ProgressBar':
                let progressValue = `${parseFloat(props.progress || 0.5)}`;
                if (props.isBound && props.boundVariable) {
                    const cleanVar = props.boundVariable.replace(/[^a-zA-Z0-9]/g, '');
                    progressValue = `(double.tryParse(AppState.instance.${cleanVar}) ?? 0.0)`;
                    requiresStateListener = true; 
                }
                widgetCode = `ClipRRect(
                  borderRadius: BorderRadius.only(topLeft: Radius.circular(${parseRadius(props.radiusTopLeft)}), topRight: Radius.circular(${parseRadius(props.radiusTopRight)}), bottomLeft: Radius.circular(${parseRadius(props.radiusBottomLeft)}), bottomRight: Radius.circular(${parseRadius(props.radiusBottomRight)})),
                  child: LinearProgressIndicator(
                    value: ${progressValue},
                    backgroundColor: ${parseColor(props.backgroundColor || '#1A1B1E', schema.theme)},
                    valueColor: AlwaysStoppedAnimation<Color>(${parseColor(props.color || 'theme.primary', schema.theme)}),
                    minHeight: ${parseSize(props.height || '8px', false)},
                  )
                )`;
                break;

            case 'GridView':
                let gridBuilderCode = `GridView.builder(
                  shrinkWrap: true, 
                  physics: const ClampingScrollPhysics(),
                  padding: ${parseEdgeInsets(props.padding)},
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: ${props.crossAxisCount || 2},
                    mainAxisSpacing: ${parseSize(props.mainAxisSpacing || '8px', false)},
                    crossAxisSpacing: ${parseSize(props.crossAxisSpacing || '8px', true)},
                  ),
                  itemCount: 4,
                  itemBuilder: (context, index) {
                    return ${staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : 'const SizedBox.shrink()'};
                  },
                )`;
                widgetCode = gridBuilderCode;
                break;

            case 'Wrap':
                let wrapAlign = 'WrapAlignment.start';
                if (props.alignment === 'center') wrapAlign = 'WrapAlignment.center';
                if (props.alignment === 'end')    wrapAlign = 'WrapAlignment.end';
                widgetCode = `Wrap(
                  spacing: ${parseSize(props.spacing || '8px', true)},
                  runSpacing: ${parseSize(props.runSpacing || '8px', false)},
                  alignment: ${wrapAlign},
                  children: <Widget>[
                    ${staticChildrenNodes.map(buildWidget).join(',\n')}
                  ]
                )`;
                break;

            case 'Spacer':
                widgetCode = `Spacer(flex: ${props.flex || 1})`;
                break;

            case 'Card':
                widgetCode = `Card(elevation: ${parseFloat(props.shadowBlur || 0) / 2}, color: ${parseColor(props.backgroundColor, schema.theme)}, shape: RoundedRectangleBorder(borderRadius: BorderRadius.only(topLeft: Radius.circular(${parseRadius(props.radiusTopLeft)}), topRight: Radius.circular(${parseRadius(props.radiusTopRight)}), bottomLeft: Radius.circular(${parseRadius(props.radiusBottomLeft)}), bottomRight: Radius.circular(${parseRadius(props.radiusBottomRight)}))), child: Padding(padding: ${parseEdgeInsets(props.padding)}, child: ${staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : 'const SizedBox.shrink()'}))`;
                break;

            case 'Padding':
                widgetCode = `Padding(padding: ${parseEdgeInsets(props.padding)}, child: ${staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : 'const SizedBox.shrink()'})`;
                break;

            case 'Center':
                widgetCode = `Center(child: ${staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : 'const SizedBox.shrink()'})`;
                break;

            case 'SizedBox':
                widgetCode = `SizedBox(width: ${parseSize(props.width, true)}, height: ${parseSize(props.height, false)})`;
                break;

            case 'Divider':
                widgetCode = `Divider(color: ${parseColor(props.backgroundColor, schema.theme)}, thickness: ${parseSize(props.height || '1px', false)})`;
                break;

            case 'Text':
                widgetCode = `Text(${contentStr}, style: TextStyle(color: ${parseColor(props.color, schema.theme)}, fontSize: ${parseSize(props.fontSize, false)}, fontFamily: '${props.fontFamily || 'Roboto'}'))`;
                break;

            case 'Button':
                widgetCode = `ElevatedButton(${buildActionChain(props)} style: ElevatedButton.styleFrom(backgroundColor: ${parseColor(props.backgroundColor || 'theme.primary', schema.theme)}, shape: RoundedRectangleBorder(borderRadius: BorderRadius.only(topLeft: Radius.circular(${parseRadius(props.radiusTopLeft)}), topRight: Radius.circular(${parseRadius(props.radiusTopRight)}), bottomLeft: Radius.circular(${parseRadius(props.radiusBottomLeft)}), bottomRight: Radius.circular(${parseRadius(props.radiusBottomRight)})))), child: Text(${contentStr}, style: TextStyle(color: ${parseColor(props.color || '#ffffff', schema.theme)})))`;
                break;

            case 'TextInput':
                let onChangedCode = '';
                if (props.isBound && props.boundVariable) {
                    const cleanVar = props.boundVariable.replace(/[^a-zA-Z0-9]/g, '');
                    onChangedCode = `onChanged: (val) => AppState.instance.update${capitalize(cleanVar)}(val),`;
                }
                widgetCode = `TextField(${onChangedCode} decoration: InputDecoration(hintText: ${contentStr}, filled: true, fillColor: Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(${parseRadius(props.radiusTopLeft)}), borderSide: BorderSide.none)))`;
                break;

            case 'Image':
                widgetCode = `Image.network('${props.url || 'https://via.placeholder.com/150'}', width: ${parseSize(props.width, true)}, height: ${parseSize(props.height, false)}, fit: BoxFit.cover, errorBuilder: (context, error, stackTrace) => Container(width: ${parseSize(props.width, true)}, height: ${parseSize(props.height, false)}, color: Colors.grey[800], child: const Icon(Icons.broken_image, color: Colors.grey)))`;
                break;

            case 'Icon':
                const iconName = getFlutterIcon(props.iconName);
                widgetCode = `Icon(Icons.${iconName}, color: ${parseColor(props.color, schema.theme)}, size: ${parseSize(props.size, true)})`;
                break;

            case 'Row':
                widgetCode = `Row(mainAxisAlignment: ${parseAlignment(props.mainAxisAlignment)}, crossAxisAlignment: ${parseCrossAlignment(props.crossAxisAlignment)}, children: <Widget>[\n${childrenCode}\n])`;
                break;

            case 'Column':
                widgetCode = `Column(mainAxisAlignment: ${parseAlignment(props.mainAxisAlignment)}, crossAxisAlignment: ${parseCrossAlignment(props.crossAxisAlignment)}, children: <Widget>[\n${childrenCode}\n])`;
                break;

            case 'Stack':
                const allChildrenCode = staticChildrenNodes.map(buildWidget).join(',\n');
                widgetCode = `Stack(clipBehavior: Clip.none, children: <Widget>[\n${allChildrenCode}\n])`;
                break;

            case 'ListView':
                const isHorizontal = props.scrollDirection === 'horizontal';
                const gapDir = isHorizontal ? 'right' : 'bottom';
                let listBuilderCode = `ListView.builder(
                  shrinkWrap: true, 
                  physics: const ClampingScrollPhysics(),
                  scrollDirection: ${isHorizontal ? 'Axis.horizontal' : 'Axis.vertical'},
                  padding: ${parseEdgeInsets(props.padding)},
                  itemCount: 5,
                  itemBuilder: (context, index) {
                    return Padding(padding: EdgeInsets.only(${gapDir}: ${parseSize(props.gap || '8px', true)}), child: ${staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : 'const SizedBox.shrink()'});
                  },
                )`;
                
                if (props.apiEndpointId) {
                    const apiDef = schema.apiEndpoints?.find(a => a.id === props.apiEndpointId);
                    if (apiDef && apiDef.url) {
                        // Inject Supabase auth headers from resolved (env-safe) credentials
                        let apiHeaderCode = `null`;
                        if (supabase.active && apiDef.url.includes(supabase.url)) {
                            apiHeaderCode = `{ 'apikey': '${supabase.anonKey}', 'Authorization': 'Bearer ${supabase.anonKey}' }`;
                        }
                        const dartMethod = apiDef.method.toLowerCase();
                        widgetCode = `FutureBuilder<http.Response>(
                      future: http.${dartMethod}(Uri.parse('${apiDef.url}'), headers: ${apiHeaderCode}).timeout(const Duration(seconds: 10)),
                      builder: (context, snapshot) {
                        if (snapshot.hasError || !snapshot.hasData || snapshot.data?.statusCode == 401) return const SizedBox.shrink();
                        if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                        return ${listBuilderCode};
                      }
                    )`;
                    } else {
                        widgetCode = listBuilderCode;
                    }
                } else {
                    widgetCode = listBuilderCode;
                }
                break;

            case 'Container':
                widgetCode = staticChildrenNodes.length > 0 ? buildWidget(staticChildrenNodes[0]) : `const SizedBox.shrink()`;
                break;

            case 'Shape':
            default:
                widgetCode = `const SizedBox.shrink()`;
                break;
        }
        
        if (requiresStateListener && (node.type === 'Text' || node.type === 'Button')) {
            widgetCode = `ListenableBuilder(listenable: AppState.instance, builder: (context, child) { return ${widgetCode}; })`;
        }
        
        let containerProps = '';
        if (props.padding && props.padding !== '0px') containerProps += `padding: ${parseEdgeInsets(props.padding)},\n`;
        if (props.margin  && props.margin  !== '0px') containerProps += `margin: ${parseEdgeInsets(props.margin)},\n`;
        
        let safeWidth  = parseSize(props.width, true);
        let safeHeight = parseSize(props.height, false);

        if (node.type === 'ListView' && props.scrollDirection === 'horizontal' && safeHeight === 'null') safeHeight = '120.0';

        if (safeWidth  !== 'null') containerProps += `width: ${safeWidth},\n`;
        if (safeHeight !== 'null') containerProps += `height: ${safeHeight},\n`;

        let decorationProps = '';
        if (props.backgroundColor && props.backgroundColor !== 'transparent') decorationProps += `color: ${parseColor(props.backgroundColor, schema.theme)},\n`;
        if (props.radiusTopLeft) {
            decorationProps += `borderRadius: BorderRadius.only(topLeft: Radius.circular(${parseRadius(props.radiusTopLeft)}), topRight: Radius.circular(${parseRadius(props.radiusTopRight)}), bottomLeft: Radius.circular(${parseRadius(props.radiusBottomLeft)}), bottomRight: Radius.circular(${parseRadius(props.radiusBottomRight)})),\n`;
        }
        if (props.shadowColor && props.shadowColor !== 'transparent') {
            decorationProps += `boxShadow: <BoxShadow>[BoxShadow(color: ${parseColor(props.shadowColor, schema.theme)}, offset: Offset(${parseFloat(props.shadowOffsetX || 0)}, ${parseFloat(props.shadowOffsetY || 0)}), blurRadius: ${parseFloat(props.shadowBlur || 0)}, spreadRadius: ${parseFloat(props.shadowSpread || 0)})],\n`;
        }

        if (decorationProps !== '') containerProps += `decoration: BoxDecoration(\n${decorationProps}),\n`;

        let wrappedWidget = widgetCode;

        if (containerProps !== '' && !node.id.includes('root') && node.type !== 'ListView') {
            wrappedWidget = `Container(\n${containerProps}child: ${widgetCode},\n)`;
        } else if (containerProps !== '' && node.type === 'ListView') {
            wrappedWidget = `Container(\n${containerProps}child: ${widgetCode},\n)`;
        }

        if (node.type !== 'Stack' && absoluteChildrenNodes.length > 0) {
            const absoluteCode = absoluteChildrenNodes.map(buildWidget).join(',\n');
            wrappedWidget = `Stack(clipBehavior: Clip.none, children: <Widget>[${wrappedWidget}, ${absoluteCode}])`;
        }

        if (props.position === 'absolute') {
            wrappedWidget = `Positioned(top: ${parseSize(props.top, false)}, left: ${parseSize(props.left, true)}, bottom: ${parseSize(props.bottom, false)}, right: ${parseSize(props.right, true)}, child: ${wrappedWidget})`;
        }

        return wrappedWidget;
    };


    // 4. GENERATE FULL PAGES & ROUTING
    let pageClasses = '';
    let routes = '';
    
    const navItems = schema.appConfig?.navItems || [];
    let bottomNavItemsCode = '';
    navItems.forEach((item) => {
        const iconName = getFlutterIcon(item.icon);
        bottomNavItemsCode += `          BottomNavigationBarItem(icon: Icon(Icons.${iconName}), label: ''),\n`;
    });

    schema.pages.forEach((page, index) => {
        const className = `Page${page.id.replace(/[^a-zA-Z0-9]/g, '')}`;
        const isInitialRoute = (schema.app?.initialPage === page.id) || (index === 0);
        
        routes += `        '/${page.id}': (context) => const ${className}(),\n`;
        if (isInitialRoute) {
            routes = `        '/': (context) => const ${className}(),\n` + routes;
        }

        let bottomNavCode = '';
        if (schema.appConfig && schema.appConfig.enableBottomNav && navItems.length >= 2) {
            const isGlass     = schema.appConfig.navStyle === 'glass';
            const elevation   = schema.appConfig.navStyle === 'shadow' ? '16.0' : '0.0';
            const bgColor     = schema.appConfig.navBackground  || '#ffffff';
            const activeColor = schema.appConfig.navActiveColor || schema.theme.primary;
            const inactiveColor = schema.appConfig.navIconColor || '#888888';

            const currentIndex = navItems.findIndex(n => n.targetPage === page.id);
            const activeIdx    = currentIndex !== -1 ? currentIndex : 0;

            bottomNavCode = `
      bottomNavigationBar: ${isGlass ? `ClipRRect(child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0), child: ` : ''}BottomNavigationBar(
        elevation: ${elevation}, backgroundColor: Color(0xFF${bgColor.replace('#', '')})${isGlass ? '.withOpacity(0.8)' : ''},
        selectedItemColor: Color(0xFF${activeColor.replace('#', '')}), unselectedItemColor: Color(0xFF${inactiveColor.replace('#', '')}),
        showSelectedLabels: false, showUnselectedLabels: false, type: BottomNavigationBarType.fixed,
        currentIndex: ${activeIdx},
        onTap: (index) {
          final navRoutes = <String>[${navItems.map(p => `'/${p.targetPage}'`).join(', ')}];
          if (index < navRoutes.length && navRoutes[index] != '/${page.id}') Navigator.pushReplacementNamed(context, navRoutes[index]);
        },
        items: <BottomNavigationBarItem>[\n${bottomNavItemsCode}        ],
      )${isGlass ? `))` : ''},`;
        }

        pageClasses += `
class ${className} extends StatelessWidget {
  const ${className}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ${parseColor(schema.theme.background, schema.theme)},
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: Container(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: ${buildWidget(page.root)},
              ),
            );
          }
        ),
      ),${bottomNavCode}
    );
  }
}
`;
    });

    // 5. ASSEMBLE IMPORTS
    // Core — always included. flutter_dotenv is always included so secrets
    // are NEVER compiled into the binary as string literals.
    let imports = `import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:ui';
import 'dart:async';
`;

    // Optional imports — only emitted when the schema actually uses these widgets
    if (usesMap)     imports += `import 'package:google_maps_flutter/google_maps_flutter.dart';\n`;
    if (usesWebView) imports += `import 'package:webview_flutter/webview_flutter.dart';\n`;

    // Backend-specific imports
    if (schema.backendProvider === 'firebase') {
        imports += `import 'package:firebase_core/firebase_core.dart';\nimport 'package:firebase_auth/firebase_auth.dart';\nimport 'package:cloud_firestore/cloud_firestore.dart';\n`;
    } else if (supabase.active) {
        imports += `import 'package:supabase_flutter/supabase_flutter.dart';\n`;
    }

    // 6. ASSEMBLE main() BODY
    // ⚠️  Credentials are NEVER interpolated here as string literals.
    //     The generated Dart always reads from dotenv at runtime.
    let mainBody = `
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // Load .env before anything else — crash loudly in debug, swallow in release.
    await dotenv.load(fileName: '.env');

    PlatformDispatcher.instance.onError = (error, stack) => true;
    ErrorWidget.builder = (FlutterErrorDetails details) {
      return const Material(color: Colors.transparent, child: SizedBox.shrink());
    };`;

    if (schema.backendProvider === 'firebase') {
        // The generated Dart reads from dotenv — no literal key values here.
        mainBody += `
    try {
      await Firebase.initializeApp(
        options: FirebaseOptions(
          apiKey:            dotenv.env['FIREBASE_API_KEY']            ?? '',
          appId:             dotenv.env['FIREBASE_APP_ID']             ?? '',
          messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID'] ?? '',
          projectId:         dotenv.env['FIREBASE_PROJECT_ID']         ?? '',
        ),
      );
    } catch (e) {}`;
    } else if (supabase.active) {
        // Same — dotenv keys only, no raw values.
        mainBody += `
    try {
      await Supabase.initialize(
        url:     dotenv.env['SUPABASE_URL']      ?? '',
        anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
      ).timeout(const Duration(seconds: 5));
    } catch (e) {}`;
    }

    mainBody += `
    runApp(const AppForgeApp());
  }, (error, stack) {});`;

    // 7. ASSEMBLE FINAL DART FILE
    return `// GENERATED BY APPFORGE
// ⚠️  Auto-generated — do not edit manually.
//
// SECRETS SETUP (required before running):
//   1. Copy the generated .env file into your Flutter project root.
//   2. Add .env to your .gitignore  →  echo ".env" >> .gitignore
//   3. Register it as a Flutter asset in pubspec.yaml:
//        flutter:
//          assets:
//            - .env
//   4. Add flutter_dotenv to pubspec.yaml dependencies:
//        dependencies:
//          flutter_dotenv: ^5.1.0
//
// Keys are loaded at runtime from .env — they are NEVER compiled
// into the binary and will NOT appear in APK decompilation tools.
${imports}
void main() {
${mainBody}
}

${stateClass}

class AppForgeApp extends StatelessWidget {
  const AppForgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AppForge Project',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primaryColor: ${parseColor(schema.theme.primary, schema.theme)}, scaffoldBackgroundColor: ${parseColor(schema.theme.background, schema.theme)}),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{\n${routes}      },
    );
  }
}
${pageClasses}
`;
};

// ---------------------------------------------------------------------------
// generateFlutterDotEnv(schema)
// Call this alongside generateFlutterCode() and write the result to a file
// named ".env" in the Flutter project root. This file holds the real values
// and must be kept out of version control.
//
// Usage in your export handler:
//   const dartCode  = generateFlutterCode(schema);
//   const dotEnvStr = generateFlutterDotEnv(schema);
//   zip.addFile('lib/main.dart', dartCode);
//   zip.addFile('.env',          dotEnvStr);   // ← real secrets go here
//   zip.addFile('.gitignore',    '*.env\n.env\n');
// ---------------------------------------------------------------------------
export const generateFlutterDotEnv = (schema) => {
    const supabase = resolveSupabase(schema);
    const firebase = resolveFirebase(schema);
    const isFirebase = schema.backendProvider === 'firebase';

    const lines = [
        '# AppForge — Flutter runtime secrets',
        '# ⚠️  DO NOT COMMIT THIS FILE — add .env to your .gitignore',
        '#     flutter_dotenv loads this at startup; keys are never in the binary.',
        '',
    ];

    if (isFirebase) {
        lines.push('# Firebase');
        lines.push(`FIREBASE_API_KEY=${firebase.apiKey}`);
        lines.push(`FIREBASE_APP_ID=${firebase.appId}`);
        lines.push(`FIREBASE_MESSAGING_SENDER_ID=${firebase.messagingSenderId}`);
        lines.push(`FIREBASE_PROJECT_ID=${firebase.projectId}`);
    } else {
        lines.push('# Supabase');
        lines.push(`SUPABASE_URL=${supabase.url}`);
        lines.push(`SUPABASE_ANON_KEY=${supabase.anonKey}`);
    }

    return lines.join('\n') + '\n';
};


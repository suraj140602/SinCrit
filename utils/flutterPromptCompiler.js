// =============================================================================
// flutterPromptCompiler.js
// AppForge — Master Prompt Intelligence Engine
//
// Converts your visual schema + task into a dense, structured system prompt
// that transforms Gemini (or any LLM) into a Flutter/Dart/Backend specialist
// with full knowledge of your widget system, design tokens, and store themes.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: COMPLETE WIDGET KNOWLEDGE BASE
// Every widget AppForge supports, with its full Dart signature, props,
// common mistakes, and the exact code pattern the generator produces.
// ─────────────────────────────────────────────────────────────────────────────

const WIDGET_KNOWLEDGE = {

    // ── LAYOUT ──────────────────────────────────────────────────────────────────

    Column: {
        category: 'layout',
        dartClass: 'Column',
        description: 'Vertical flex container. Direct equivalent of Flutter Column widget.',
        schemaProps: {
            mainAxisAlignment: 'start | center | end | spaceBetween',
            crossAxisAlignment: 'start | center | stretch',
            gap: 'px value applied as SizedBox between children',
            padding: 'EdgeInsets shorthand e.g. "16px" or "8px 16px"',
            width: 'px, %, or auto',
            height: 'px, %, or auto',
            backgroundColor: 'hex, theme.primary, theme.secondary, transparent',
        },
        dartPattern: `Column(
  mainAxisAlignment: MainAxisAlignment.start, // or .center .end .spaceBetween
  crossAxisAlignment: CrossAxisAlignment.stretch, // or .start .center
  children: <Widget>[
    // children separated by SizedBox(height: gap)
  ],
)`,
        pitfalls: [
            'Column inside Column with unbounded height causes RenderFlex overflow — wrap inner Column with Expanded() or set a fixed height',
            'Column inside ListView causes "Column has infinite height" error — set shrinkWrap: true on ListView or fix Column height',
            'crossAxisAlignment.stretch requires children to have width constraints',
        ],
        wrappers: ['Expanded', 'Flexible', 'SingleChildScrollView', 'SizedBox(height: x, child: ...)'],
    },

    Row: {
        category: 'layout',
        dartClass: 'Row',
        description: 'Horizontal flex container.',
        schemaProps: {
            mainAxisAlignment: 'start | center | end | spaceBetween',
            crossAxisAlignment: 'start | center | stretch',
            gap: 'px value → SizedBox(width: gap) between children',
        },
        dartPattern: `Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: <Widget>[
    // children separated by SizedBox(width: gap)
  ],
)`,
        pitfalls: [
            'Row inside Row with unbounded width — wrap with Expanded()',
            'Text inside Row without Expanded causes overflow — always wrap Text in Expanded when inside Row',
            'Row with many children needs Wrap widget instead when screen is narrow',
        ],
    },

    Container: {
        category: 'layout',
        dartClass: 'Container',
        description: 'Box with decoration, sizing, padding, margin. Most versatile layout widget.',
        schemaProps: {
            width: 'px or %',
            height: 'px or %',
            padding: 'inner spacing',
            margin: 'outer spacing',
            backgroundColor: 'hex or theme token',
            backgroundType: 'solid | gradient | theme.primary | theme.secondary | transparent',
            gradientStart: 'hex — used when backgroundType is gradient',
            gradientEnd: 'hex — used when backgroundType is gradient',
            radiusTopLeft: 'px → Radius.circular()',
            radiusTopRight: 'px',
            radiusBottomLeft: 'px',
            radiusBottomRight: 'px',
            borderWidth: 'px → Border.all(width: x)',
            borderColor: 'hex',
            shadowColor: 'rgba or hex',
            shadowOffsetX: 'number',
            shadowOffsetY: 'number',
            shadowBlur: 'number → blurRadius',
            shadowSpread: 'number → spreadRadius',
            opacity: '0.0–1.0',
        },
        dartPattern: `Container(
  width: 200.0,
  height: 120.0,
  padding: EdgeInsets.all(16.0),
  margin: EdgeInsets.only(bottom: 12.0),
  decoration: BoxDecoration(
    color: Color(0xFF1E293B),
    // OR for gradient:
    gradient: LinearGradient(
      colors: [Color(0xFF6366F1), Color(0xFFEC4899)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    borderRadius: BorderRadius.only(
      topLeft: Radius.circular(16.0),
      topRight: Radius.circular(16.0),
      bottomLeft: Radius.circular(16.0),
      bottomRight: Radius.circular(16.0),
    ),
    border: Border.all(color: Color(0xFF334155), width: 1.0),
    boxShadow: [
      BoxShadow(
        color: Color(0x40000000),
        offset: Offset(0, 8),
        blurRadius: 24.0,
        spreadRadius: 0.0,
      ),
    ],
  ),
  child: /* your widget */,
)`,
    },

    Stack: {
        category: 'layout',
        dartClass: 'Stack',
        description: 'Overlapping children. Children with position=absolute become Positioned().',
        schemaProps: {
            width: 'px',
            height: 'px — required for Stack to have bounds',
        },
        dartPattern: `Stack(
  clipBehavior: Clip.none,
  children: <Widget>[
    // Normal children render at top-left
    Container(...),
    // Absolute-positioned children become:
    Positioned(
      top: 12.0,
      right: 16.0,
      child: Icon(Icons.favorite),
    ),
  ],
)`,
        pitfalls: [
            'Stack with no size constraints will shrink to smallest child',
            'Positioned children outside Stack bounds need clipBehavior: Clip.none',
            'Never use Expanded or Flexible directly inside Stack — use Positioned instead',
        ],
    },

    ListView: {
        category: 'layout',
        dartClass: 'ListView.builder',
        description: 'Scrollable list. Renders first child as the item template, repeats it.',
        schemaProps: {
            scrollDirection: 'vertical | horizontal',
            gap: 'spacing between items',
            apiEndpointId: 'connects to a live API endpoint for dynamic data',
        },
        dartPattern: `ListView.builder(
  shrinkWrap: true,
  physics: const ClampingScrollPhysics(),
  scrollDirection: Axis.vertical, // or Axis.horizontal
  padding: EdgeInsets.all(16.0),
  itemCount: 10, // or snapshot.data.length for API
  itemBuilder: (context, index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: /* your item widget */,
    );
  },
)`,
        pitfalls: [
            'ListView inside Column without shrinkWrap: true causes infinite height error',
            'Horizontal ListView needs an explicit height on its parent',
            'Never put unbounded Column inside ListView items — causes infinite height',
        ],
    },

    GridView: {
        category: 'layout',
        dartClass: 'GridView.builder',
        description: 'Responsive grid layout.',
        schemaProps: {
            crossAxisCount: 'number of columns',
            mainAxisSpacing: 'vertical gap between rows',
            crossAxisSpacing: 'horizontal gap between columns',
        },
        dartPattern: `GridView.builder(
  shrinkWrap: true,
  physics: const ClampingScrollPhysics(),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    mainAxisSpacing: 12.0,
    crossAxisSpacing: 12.0,
    childAspectRatio: 1.0, // width/height ratio of each cell
  ),
  itemCount: 6,
  itemBuilder: (context, index) => /* item widget */,
)`,
    },

    PageView: {
        category: 'layout',
        dartClass: 'PageView',
        description: 'Full-screen pager. Each child fills the viewport.',
        dartPattern: `PageView(
  controller: PageController(),
  scrollDirection: Axis.horizontal,
  onPageChanged: (index) => setState(() => _currentPage = index),
  children: <Widget>[
    /* screen 1 */,
    /* screen 2 */,
  ],
)`,
    },

    Carousel: {
        category: 'layout',
        dartClass: 'PageView with viewportFraction',
        description: 'Peeking carousel — shows edges of adjacent cards.',
        dartPattern: `PageView(
  controller: PageController(viewportFraction: 0.85),
  scrollDirection: Axis.horizontal,
  children: <Widget>[
    Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      child: /* card widget */,
    ),
  ],
)`,
    },

    Wrap: {
        category: 'layout',
        dartClass: 'Wrap',
        description: 'Flows children onto next line when row is full. Good for tag chips.',
        dartPattern: `Wrap(
  spacing: 8.0,      // horizontal gap
  runSpacing: 8.0,   // vertical gap between rows
  alignment: WrapAlignment.start,
  children: <Widget>[
    Chip(label: Text('Tag 1')),
    Chip(label: Text('Tag 2')),
  ],
)`,
    },

    Spacer: {
        category: 'layout',
        dartClass: 'Spacer',
        description: 'Flexible space inside Row or Column. Pushes siblings apart.',
        dartPattern: `Row(
  children: [
    Text('Left'),
    Spacer(flex: 1), // fills remaining space
    Text('Right'),
  ],
)`,
    },

    SizedBox: {
        category: 'layout',
        dartClass: 'SizedBox',
        description: 'Fixed-size whitespace or size constraint box.',
        dartPattern: `SizedBox(width: 16.0, height: 24.0)
// As spacer between items:
const SizedBox(height: 12.0)`,
    },

    Padding: {
        category: 'layout',
        dartClass: 'Padding',
        description: 'Adds inner spacing around a single child.',
        dartPattern: `Padding(
  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
  child: /* widget */,
)`,
    },

    Center: {
        category: 'layout',
        dartClass: 'Center',
        description: 'Centers a single child within available space.',
        dartPattern: `Center(child: Text('Centered'))`,
    },

    // ── BASIC ELEMENTS ───────────────────────────────────────────────────────────

    Text: {
        category: 'basic',
        dartClass: 'Text',
        description: 'Displays a string. Supports state binding via AppState.',
        schemaProps: {
            content: 'static string',
            fontSize: 'px value',
            color: 'hex or theme token',
            fontFamily: 'Inter | Roboto | Poppins | Montserrat | Playfair Display | monospace',
            fontWeight: 'normal | 500 | bold | 300',
            textAlign: 'left | center | right | justify',
            letterSpacing: 'px value',
            isBound: 'boolean — links content to a state variable',
            boundVariable: 'key from appState array',
        },
        dartPattern: `// Static:
Text(
  'Hello World',
  style: TextStyle(
    color: Color(0xFFFFFFFF),
    fontSize: 18.0,
    fontWeight: FontWeight.bold,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
)

// State-bound (requires ListenableBuilder):
ListenableBuilder(
  listenable: AppState.instance,
  builder: (context, child) => Text(
    AppState.instance.userName,
    style: const TextStyle(color: Colors.white),
  ),
)`,
    },

    Button: {
        category: 'basic',
        dartClass: 'ElevatedButton',
        description: 'Tappable button. Executes an actionChain on press.',
        schemaProps: {
            label: 'button text',
            backgroundColor: 'hex or theme token',
            color: 'text color',
            actionChain: 'array of actions: navigate, toast, api, state, supabase',
        },
        dartPattern: `ElevatedButton(
  onPressed: () {
    // navigate:
    Navigator.pushNamed(context, '/page_id');
    // toast:
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Success!')),
    );
    // state update:
    AppState.instance.updateCounter(AppState.instance.counter + 1);
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: const Color(0xFF6366F1),
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 24.0),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12.0),
    ),
    elevation: 0,
  ),
  child: const Text(
    'Sign In',
    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16.0),
  ),
)`,
    },

    TextInput: {
        category: 'basic',
        dartClass: 'TextField',
        description: 'Text input field. Can bind to AppState variable.',
        schemaProps: {
            placeholder: 'hint text',
            isBound: 'boolean',
            boundVariable: 'appState key to update on change',
        },
        dartPattern: `TextField(
  controller: _emailController, // use TextEditingController
  onChanged: (val) => AppState.instance.updateEmail(val),
  obscureText: false, // true for passwords
  keyboardType: TextInputType.emailAddress,
  style: const TextStyle(color: Colors.white),
  decoration: InputDecoration(
    hintText: 'Enter your email',
    hintStyle: const TextStyle(color: Color(0xFF64748B)),
    filled: true,
    fillColor: const Color(0xFF1E293B),
    prefixIcon: const Icon(Icons.mail_outline, color: Color(0xFF6366F1)),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12.0),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12.0),
      borderSide: const BorderSide(color: Color(0xFF6366F1), width: 1.5),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
  ),
)`,
    },

    Icon: {
        category: 'basic',
        dartClass: 'Icon',
        description: 'Material icon. iconName maps from Lucide names to Material Icons.',
        schemaProps: {
            iconName: 'Lucide icon name — auto-converted to Icons.snake_case',
            color: 'hex',
            size: 'px',
        },
        dartPattern: `Icon(
  Icons.favorite_rounded, // rounded variants look better on mobile
  color: Color(0xFFEC4899),
  size: 24.0,
)`,
        lucideToMaterialExamples: {
            'Heart': 'Icons.favorite',
            'Home': 'Icons.home_rounded',
            'Search': 'Icons.search_rounded',
            'User': 'Icons.person_rounded',
            'Settings': 'Icons.settings_rounded',
            'Bell': 'Icons.notifications_rounded',
            'Mail': 'Icons.mail_rounded',
            'Lock': 'Icons.lock_rounded',
            'Eye': 'Icons.visibility_rounded',
            'EyeOff': 'Icons.visibility_off_rounded',
            'Plus': 'Icons.add_rounded',
            'X': 'Icons.close_rounded',
            'ChevronRight': 'Icons.chevron_right_rounded',
            'ArrowLeft': 'Icons.arrow_back_ios_new_rounded',
            'Trash': 'Icons.delete_rounded',
            'Edit': 'Icons.edit_rounded',
            'Check': 'Icons.check_rounded',
            'Star': 'Icons.star_rounded',
            'Share': 'Icons.share_rounded',
            'Download': 'Icons.download_rounded',
            'Upload': 'Icons.upload_rounded',
            'Camera': 'Icons.camera_alt_rounded',
            'Map': 'Icons.map_rounded',
            'Phone': 'Icons.phone_rounded',
            'Video': 'Icons.videocam_rounded',
            'Mic': 'Icons.mic_rounded',
            'Calendar': 'Icons.calendar_today_rounded',
            'Clock': 'Icons.access_time_rounded',
            'Globe': 'Icons.language_rounded',
            'Zap': 'Icons.bolt_rounded',
            'Shield': 'Icons.security_rounded',
            'Database': 'Icons.storage_rounded',
            'Code': 'Icons.code_rounded',
            'Layers': 'Icons.layers_rounded',
            'BarChart': 'Icons.bar_chart_rounded',
            'PieChart': 'Icons.pie_chart_rounded',
            'TrendingUp': 'Icons.trending_up_rounded',
            'ShoppingCart': 'Icons.shopping_cart_rounded',
            'ShoppingBag': 'Icons.shopping_bag_rounded',
            'CreditCard': 'Icons.credit_card_rounded',
            'DollarSign': 'Icons.attach_money_rounded',
            'Package': 'Icons.inventory_2_rounded',
            'Truck': 'Icons.local_shipping_rounded',
            'MapPin': 'Icons.location_on_rounded',
            'Navigation': 'Icons.navigation_rounded',
            'Wifi': 'Icons.wifi_rounded',
            'Bluetooth': 'Icons.bluetooth_rounded',
            'Sun': 'Icons.wb_sunny_rounded',
            'Moon': 'Icons.dark_mode_rounded',
            'Cloud': 'Icons.cloud_rounded',
            'Filter': 'Icons.filter_list_rounded',
            'Grid': 'Icons.grid_view_rounded',
            'List': 'Icons.list_rounded',
            'Menu': 'Icons.menu_rounded',
            'MoreHorizontal': 'Icons.more_horiz_rounded',
            'MoreVertical': 'Icons.more_vert_rounded',
            'RefreshCw': 'Icons.refresh_rounded',
            'Rotate': 'Icons.rotate_right_rounded',
            'ZoomIn': 'Icons.zoom_in_rounded',
            'ZoomOut': 'Icons.zoom_out_rounded',
            'Bookmark': 'Icons.bookmark_rounded',
            'Flag': 'Icons.flag_rounded',
            'Award': 'Icons.emoji_events_rounded',
            'Gift': 'Icons.card_giftcard_rounded',
            'Briefcase': 'Icons.work_rounded',
            'Building': 'Icons.business_rounded',
            'LogOut': 'Icons.logout_rounded',
            'LogIn': 'Icons.login_rounded',
            'UserPlus': 'Icons.person_add_rounded',
            'Key': 'Icons.key_rounded',
            'Terminal': 'Icons.terminal_rounded',
            'Cpu': 'Icons.memory_rounded',
            'Server': 'Icons.dns_rounded',
            'Monitor': 'Icons.monitor_rounded',
            'Smartphone': 'Icons.smartphone_rounded',
            'Headphones': 'Icons.headphones_rounded',
            'Music': 'Icons.music_note_rounded',
            'SkipBack': 'Icons.skip_previous_rounded',
            'SkipForward': 'Icons.skip_next_rounded',
            'Play': 'Icons.play_arrow_rounded',
            'Pause': 'Icons.pause_rounded',
            'Repeat': 'Icons.repeat_rounded',
            'Shuffle': 'Icons.shuffle_rounded',
            'ThumbsUp': 'Icons.thumb_up_rounded',
            'ThumbsDown': 'Icons.thumb_down_rounded',
            'Smile': 'Icons.sentiment_satisfied_rounded',
            'Info': 'Icons.info_rounded',
            'AlertCircle': 'Icons.error_rounded',
            'AlertTriangle': 'Icons.warning_rounded',
            'HelpCircle': 'Icons.help_rounded',
            'MessageSquare': 'Icons.chat_rounded',
            'MessageCircle': 'Icons.chat_bubble_rounded',
            'Inbox': 'Icons.inbox_rounded',
            'Archive': 'Icons.archive_rounded',
            'Send': 'Icons.send_rounded',
            'Copy': 'Icons.content_copy_rounded',
            'Clipboard': 'Icons.assignment_rounded',
            'File': 'Icons.insert_drive_file_rounded',
            'FileText': 'Icons.description_rounded',
            'Folder': 'Icons.folder_rounded',
            'FolderOpen': 'Icons.folder_open_rounded',
            'Save': 'Icons.save_rounded',
            'Printer': 'Icons.print_rounded',
            'Image': 'Icons.image_rounded',
            'Film': 'Icons.movie_rounded',
            'Tv': 'Icons.tv_rounded',
            'Radio': 'Icons.radio_rounded',
            'Podcast': 'Icons.podcasts_rounded',
            'Rss': 'Icons.rss_feed_rounded',
            'Link': 'Icons.link_rounded',
            'ExternalLink': 'Icons.open_in_new_rounded',
            'AtSign': 'Icons.alternate_email_rounded',
            'Hash': 'Icons.tag_rounded',
            'Bold': 'Icons.format_bold_rounded',
            'Italic': 'Icons.format_italic_rounded',
            'Underline': 'Icons.format_underlined_rounded',
            'AlignLeft': 'Icons.format_align_left_rounded',
            'AlignCenter': 'Icons.format_align_center_rounded',
            'AlignRight': 'Icons.format_align_right_rounded',
            'Maximize': 'Icons.fullscreen_rounded',
            'Minimize': 'Icons.fullscreen_exit_rounded',
            'Type': 'Icons.title_rounded',
            'Sparkles': 'Icons.auto_awesome_rounded',
            'Wand2': 'Icons.auto_fix_high_rounded',
            'Bot': 'Icons.smart_toy_rounded',
            'Fingerprint': 'Icons.fingerprint_rounded',
            'ShieldCheck': 'Icons.verified_user_rounded',
            'Activity': 'Icons.show_chart_rounded',
            'Thermometer': 'Icons.thermostat_rounded',
            'Droplet': 'Icons.water_drop_rounded',
            'Wind': 'Icons.air_rounded',
            'Lightbulb': 'Icons.lightbulb_rounded',
            'ToggleLeft': 'Icons.toggle_off_rounded',
            'ToggleRight': 'Icons.toggle_on_rounded',
            'Compass': 'Icons.explore_rounded',
            'Target': 'Icons.gps_fixed_rounded',
            'LayoutDashboard': 'Icons.dashboard_rounded',
        },
    },

    Image: {
        category: 'media',
        dartClass: 'Image.network',
        description: 'Network image with BoxFit and border radius.',
        schemaProps: {
            url: 'https URL',
            boxFit: 'cover | contain | fill | fitWidth',
        },
        dartPattern: `ClipRRect(
  borderRadius: BorderRadius.circular(16.0),
  child: Image.network(
    'https://example.com/image.jpg',
    width: 200.0,
    height: 150.0,
    fit: BoxFit.cover,
    loadingBuilder: (context, child, progress) {
      if (progress == null) return child;
      return Container(
        width: 200.0, height: 150.0,
        color: const Color(0xFF1E293B),
        child: const Center(child: CircularProgressIndicator()),
      );
    },
    errorBuilder: (context, error, stackTrace) => Container(
      width: 200.0, height: 150.0,
      color: const Color(0xFF1E293B),
      child: const Icon(Icons.broken_image_rounded, color: Colors.grey),
    ),
  ),
)`,
    },

    Divider: {
        category: 'basic',
        dartClass: 'Divider',
        dartPattern: `Divider(
  height: 1.0,
  thickness: 1.0,
  color: Color(0x1AFFFFFF), // rgba white 10%
)`,
    },

    ProgressBar: {
        category: 'interactive',
        dartClass: 'LinearProgressIndicator in ClipRRect',
        description: 'Horizontal progress bar. Value is 0.0–1.0.',
        schemaProps: {
            progress: '0.0 to 1.0',
            color: 'fill color',
            backgroundColor: 'track color',
        },
        dartPattern: `ClipRRect(
  borderRadius: BorderRadius.circular(4.0),
  child: LinearProgressIndicator(
    value: 0.65, // or AppState.instance.someProgress
    backgroundColor: const Color(0xFF1E293B),
    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
    minHeight: 8.0,
  ),
)`,
    },

    VideoPlayer: {
        category: 'media',
        dartClass: 'VideoPlayer (video_player package)',
        requiredPackage: 'video_player: ^2.8.3',
        dartPattern: `// In StatefulWidget:
late VideoPlayerController _controller;

@override
void initState() {
  super.initState();
  _controller = VideoPlayerController.networkUrl(
    Uri.parse('https://example.com/video.mp4'),
  )..initialize().then((_) => setState(() {}));
}

@override
void dispose() {
  _controller.dispose();
  super.dispose();
}

// In build():
AspectRatio(
  aspectRatio: _controller.value.aspectRatio,
  child: VideoPlayer(_controller),
)`,
    },

    MapView: {
        category: 'media',
        dartClass: 'GoogleMap (google_maps_flutter package)',
        requiredPackage: 'google_maps_flutter: ^2.6.1',
        dartPattern: `GoogleMap(
  initialCameraPosition: const CameraPosition(
    target: LatLng(37.7749, -122.4194),
    zoom: 14.0,
  ),
  myLocationEnabled: true,
  myLocationButtonEnabled: true,
  zoomControlsEnabled: false,
  mapType: MapType.normal,
  onMapCreated: (controller) => _mapController = controller,
  markers: _markers, // Set<Marker>
)`,
    },

    WebView: {
        category: 'media',
        dartClass: 'WebViewWidget (webview_flutter package)',
        requiredPackage: 'webview_flutter: ^4.7.0',
        dartPattern: `// In StatefulWidget:
late final WebViewController _controller;

@override
void initState() {
  super.initState();
  _controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadRequest(Uri.parse('https://flutter.dev'));
}

// In build():
WebViewWidget(controller: _controller)`,
    },

    CustomCode: {
        category: 'advanced',
        dartClass: 'Any valid Dart widget',
        description: 'Escape hatch — insert raw Dart code directly.',
        dartPattern: `// rawDart prop content is inserted verbatim:
// Example: props.rawDart = "Container(color: Colors.red)"
// Compiles to: Container(color: Colors.red)`,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: BACKEND QUERY KNOWLEDGE BASE
// Complete Supabase and Firebase patterns for every operation AppForge needs.
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_KNOWLEDGE = {

    supabase: {
        setup: `// pubspec.yaml: supabase_flutter: ^2.3.4
// main.dart initialization:
await Supabase.initialize(
  url: dotenv.env['SUPABASE_URL'] ?? '',
  anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
);

// Access client anywhere:
final supabase = Supabase.instance.client;`,

        auth: {
            signUp: `final AuthResponse res = await supabase.auth.signUp(
  email: 'user@example.com',
  password: 'secure_password_min8',
);
final User? user = res.user;`,

            signIn: `final AuthResponse res = await supabase.auth.signInWithPassword(
  email: 'user@example.com',
  password: 'secure_password',
);
final Session? session = res.session;`,

            signOut: `await supabase.auth.signOut();`,

            currentUser: `final User? user = supabase.auth.currentUser;
final String? userId = user?.id;`,

            authStateChanges: `supabase.auth.onAuthStateChange.listen((data) {
  final AuthChangeEvent event = data.event;
  final Session? session = data.session;
  if (event == AuthChangeEvent.signedIn) {
    // user signed in
  }
  if (event == AuthChangeEvent.signedOut) {
    // user signed out
  }
});`,

            resetPassword: `await supabase.auth.resetPasswordForEmail('user@example.com');`,
        },

        database: {
            select: `// Select all rows:
final List<Map<String, dynamic>> data =
    await supabase.from('table_name').select();

// Select with filter:
final data = await supabase
    .from('products')
    .select('id, title, price, image_url')
    .eq('category', 'electronics')
    .order('created_at', ascending: false)
    .limit(20);

// Select single row:
final Map<String, dynamic> row = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

// Select with join:
final data = await supabase
    .from('posts')
    .select('*, author:profiles(full_name, avatar_url)')
    .order('created_at', ascending: false);`,

            insert: `// Insert a row:
await supabase.from('posts').insert({
  'title': 'My Post',
  'body': 'Post content here',
  'user_id': supabase.auth.currentUser!.id,
  'created_at': DateTime.now().toIso8601String(),
});

// Insert and return the new row:
final List<Map<String, dynamic>> newRows = await supabase
    .from('posts')
    .insert({'title': 'New Post'})
    .select();`,

            update: `await supabase
    .from('profiles')
    .update({'full_name': 'New Name', 'bio': 'Updated bio'})
    .eq('id', userId);`,

            delete: `await supabase
    .from('posts')
    .delete()
    .eq('id', postId);`,

            upsert: `await supabase.from('profiles').upsert({
  'id': userId,
  'full_name': name,
  'updated_at': DateTime.now().toIso8601String(),
});`,

            realtime: `// Listen to realtime changes on a table:
final channel = supabase.channel('public:posts');
channel.onPostgresChanges(
  event: PostgresChangeEvent.all,
  schema: 'public',
  table: 'posts',
  callback: (payload) {
    setState(() => _posts = /* rebuild list */);
  },
).subscribe();

// Cleanup in dispose():
supabase.removeChannel(channel);`,

            rpc: `// Call a Postgres function:
final data = await supabase.rpc('get_user_stats', params: {'user_id': userId});`,
        },

        storage: {
            upload: `// Upload file to bucket:
final String path = 'uploads/\${userId}/\${DateTime.now().millisecondsSinceEpoch}.jpg';
await supabase.storage.from('bucket-name').uploadBinary(
  path,
  fileBytes, // Uint8List
  fileOptions: const FileOptions(contentType: 'image/jpeg'),
);

// Get public URL:
final String publicUrl = supabase.storage.from('bucket-name').getPublicUrl(path);`,

            delete: `await supabase.storage.from('bucket-name').remove([filePath]);`,

            list: `final List<FileObject> files = await supabase.storage
    .from('bucket-name')
    .list(path: 'folder/path');`,
        },

        errorHandling: `// Always wrap in try-catch:
try {
  final data = await supabase.from('table').select().single();
  // handle data
} on PostgrestException catch (e) {
  // Database error
  debugPrint('DB Error: \${e.message}, code: \${e.code}');
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Error: \${e.message}')),
  );
} catch (e) {
  // Network or other error
  debugPrint('Error: \$e');
}`,

        futureBuilder: `FutureBuilder<List<Map<String, dynamic>>>(
  future: supabase.from('products').select().order('created_at', ascending: false),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }
    if (snapshot.hasError) {
      return Center(child: Text('Error: \${snapshot.error}'));
    }
    final products = snapshot.data ?? [];
    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];
        return ListTile(title: Text(product['title'] ?? ''));
      },
    );
  },
)`,
    },

    firebase: {
        setup: `// pubspec.yaml:
// firebase_core: ^2.27.0
// firebase_auth: ^4.17.0
// cloud_firestore: ^4.15.0
// firebase_storage: ^11.6.0

// main.dart:
await Firebase.initializeApp(
  options: FirebaseOptions(
    apiKey: dotenv.env['FIREBASE_API_KEY'] ?? '',
    appId: dotenv.env['FIREBASE_APP_ID'] ?? '',
    messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID'] ?? '',
    projectId: dotenv.env['FIREBASE_PROJECT_ID'] ?? '',
  ),
);`,

        auth: {
            signUp: `final UserCredential credential =
    await FirebaseAuth.instance.createUserWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password123',
);
final User? user = credential.user;`,

            signIn: `final UserCredential credential =
    await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password123',
);`,

            signOut: `await FirebaseAuth.instance.signOut();`,

            currentUser: `final User? user = FirebaseAuth.instance.currentUser;
final String? uid = user?.uid;`,

            authStateChanges: `FirebaseAuth.instance.authStateChanges().listen((User? user) {
  if (user == null) {
    // signed out
  } else {
    // signed in, use user.uid
  }
});`,
        },

        firestore: {
            select: `// Get a collection:
final QuerySnapshot snapshot = await FirebaseFirestore.instance
    .collection('posts')
    .orderBy('createdAt', descending: true)
    .limit(20)
    .get();

final List<Map<String, dynamic>> posts = snapshot.docs
    .map((doc) => {'id': doc.id, ...doc.data() as Map<String, dynamic>})
    .toList();

// Get single document:
final DocumentSnapshot doc = await FirebaseFirestore.instance
    .collection('users')
    .doc(userId)
    .get();
final data = doc.data() as Map<String, dynamic>?;`,

            insert: `await FirebaseFirestore.instance.collection('posts').add({
  'title': 'New Post',
  'body': 'Content here',
  'userId': FirebaseAuth.instance.currentUser!.uid,
  'createdAt': FieldValue.serverTimestamp(),
});`,

            update: `await FirebaseFirestore.instance
    .collection('users')
    .doc(userId)
    .update({'name': 'New Name', 'updatedAt': FieldValue.serverTimestamp()});`,

            delete: `await FirebaseFirestore.instance.collection('posts').doc(docId).delete();`,

            realtime: `StreamBuilder<QuerySnapshot>(
  stream: FirebaseFirestore.instance
      .collection('messages')
      .orderBy('createdAt')
      .snapshots(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) return const CircularProgressIndicator();
    final messages = snapshot.data!.docs;
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final msg = messages[index].data() as Map<String, dynamic>;
        return Text(msg['text'] ?? '');
      },
    );
  },
)`,
        },
    },

    restApi: {
        get: `import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<dynamic>> fetchItems() async {
  final response = await http
      .get(
        Uri.parse('https://api.example.com/items'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \${token}',
        },
      )
      .timeout(const Duration(seconds: 10));

  if (response.statusCode == 200) {
    return jsonDecode(response.body) as List<dynamic>;
  } else {
    throw Exception('Failed to load: \${response.statusCode}');
  }
}`,

        post: `final response = await http.post(
  Uri.parse('https://api.example.com/posts'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'title': 'New Post',
    'content': 'Post content here',
  }),
).timeout(const Duration(seconds: 10));

if (response.statusCode == 201) {
  final created = jsonDecode(response.body);
  // handle created item
}`,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: STATE MANAGEMENT KNOWLEDGE BASE
// AppForge uses a simple ChangeNotifier singleton pattern.
// ─────────────────────────────────────────────────────────────────────────────

const STATE_KNOWLEDGE = `
// AppForge State Pattern — ChangeNotifier Singleton
// ─────────────────────────────────────────────────
// State variables are declared in AppState (auto-generated).
// Generated code follows this exact pattern:

class AppState extends ChangeNotifier {
  static final AppState instance = AppState._internal();
  AppState._internal();

  // Example variables:
  String _userName = '';
  int _counter = 0;
  bool _isLoading = false;
  double _progress = 0.0;

  // Getters:
  String get userName => _userName;
  int get counter => _counter;
  bool get isLoading => _isLoading;
  double get progress => _progress;

  // Mutators — always call notifyListeners():
  void updateUserName(String val) { _userName = val; notifyListeners(); }
  void updateCounter(int val)     { _counter = val;  notifyListeners(); }
  void updateIsLoading(bool val)  { _isLoading = val; notifyListeners(); }
  void updateProgress(double val) { _progress = val; notifyListeners(); }
}

// Usage: Read state anywhere:
AppState.instance.userName

// Usage: Update state anywhere:
AppState.instance.updateCounter(AppState.instance.counter + 1);

// Usage: React to state changes in UI:
ListenableBuilder(
  listenable: AppState.instance,
  builder: (context, child) {
    return Text(AppState.instance.userName);
  },
)

// Usage: Show loading state:
if (AppState.instance.isLoading)
  const CircularProgressIndicator()
else
  ElevatedButton(onPressed: () async {
    AppState.instance.updateIsLoading(true);
    await fetchData();
    AppState.instance.updateIsLoading(false);
  }, child: const Text('Load'))
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: NAVIGATION KNOWLEDGE BASE
// AppForge uses named routes for all navigation.
// ─────────────────────────────────────────────────────────────────────────────

const NAVIGATION_KNOWLEDGE = `
// AppForge Navigation Pattern — Named Routes
// ─────────────────────────────────────────
// All pages are registered as named routes matching their page ID.

// Navigate to a page:
Navigator.pushNamed(context, '/page_id');

// Navigate and remove current page from stack (replaces):
Navigator.pushReplacementNamed(context, '/page_id');

// Navigate and clear entire history (for login flows):
Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);

// Go back:
Navigator.pop(context);

// Go back with a result:
Navigator.pop(context, {'success': true});

// Navigate with arguments:
Navigator.pushNamed(context, '/detail', arguments: {'id': itemId, 'title': name});

// Receive arguments in destination:
final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
final itemId = args['id'];

// Bottom navigation tab switching (AppForge pattern):
// Uses pushReplacementNamed to avoid stack buildup:
BottomNavigationBar(
  currentIndex: _selectedIndex,
  onTap: (index) {
    final routes = ['/home', '/search', '/profile'];
    Navigator.pushReplacementNamed(context, routes[index]);
  },
  items: [...],
)
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: STORE THEME DESIGN TOKENS
// Every theme/color palette used across AppForge templates.
// ─────────────────────────────────────────────────────────────────────────────

const STORE_THEMES = {

    darkTech: {
        name: 'Dark Tech (AppForge Default)',
        background: '#050609',
        surface: '#0d1017',
        surfaceAlt: '#161b22',
        primary: '#3b82f6',
        secondary: '#EC4899',
        accent: '#6366f1',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        textSubtle: '#64748b',
        border: 'rgba(255,255,255,0.08)',
        borderStrong: 'rgba(255,255,255,0.15)',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
        fontFamily: 'Inter',
        radius: '12px',
        usedIn: ['dashboard', 'builder', 'account pages', 'admin panel'],
    },

    crypto: {
        name: 'Crypto / DeFi',
        background: '#000000',
        surface: '#111111',
        primary: '#a855f7', // purple
        secondary: '#ec4899',
        accent: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        text: '#ffffff',
        textMuted: '#94a3b8',
        glow: 'rgba(168,85,247,0.4)',
        fontFamily: 'Inter',
        usedIn: ['crypto wallet', 'NFT market', 'DeFi dashboard'],
        dartGradient: `LinearGradient(
  colors: [Color(0xFF6366F1), Color(0xFFA855F7)],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
)`,
    },

    fintech: {
        name: 'Fintech / Banking',
        background: '#0f172a',
        surface: '#1e293b',
        primary: '#10b981', // emerald
        secondary: '#3b82f6',
        accent: '#06b6d4',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        positiveColor: '#4ade80',
        negativeColor: '#ef4444',
        fontFamily: 'Inter',
        usedIn: ['finance dashboard', 'banking app', 'investment tracker'],
    },

    ecommerce: {
        name: 'E-Commerce / Shop',
        background: '#ffffff',
        surface: '#f9fafb',
        surfaceDark: '#f3f4f6',
        primary: '#ec4899', // pink
        secondary: '#f59e0b',
        accent: '#8b5cf6',
        text: '#111827',
        textMuted: '#6b7280',
        textSubtle: '#9ca3af',
        border: '#e5e7eb',
        fontFamily: 'Inter',
        radius: '16px',
        usedIn: ['product pages', 'cart', 'storefront', 'checkout'],
    },

    social: {
        name: 'Social Media / Feed',
        background: '#0a0a0b',
        surface: '#111118',
        surfaceAlt: '#1e1e2e',
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#06b6d4',
        text: '#ffffff',
        textMuted: '#9ca3af',
        fontFamily: 'Inter',
        usedIn: ['home feed', 'profile', 'stories', 'chat'],
    },

    healthcare: {
        name: 'Healthcare / Medical',
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#06b6d4', // cyan
        secondary: '#10b981',
        accent: '#3b82f6',
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e2e8f0',
        fontFamily: 'Inter',
        radius: '12px',
        usedIn: ['health dashboard', 'appointment booking', 'vitals tracker'],
    },

    fitness: {
        name: 'Fitness / Sports',
        background: '#060609',
        surface: '#111118',
        primary: '#10b981', // emerald
        secondary: '#06b6d4',
        accent: '#f59e0b',
        text: '#ffffff',
        textMuted: '#94a3b8',
        gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
        fontFamily: 'Inter',
        usedIn: ['fitness tracker', 'workout app', 'health metrics'],
    },

    restaurant: {
        name: 'Restaurant / Food',
        background: '#1c1917',
        surface: '#292524',
        primary: '#b91c1c', // dark red
        secondary: '#f97316',
        accent: '#fca5a5',
        text: '#ffffff',
        textMuted: '#d6d3d1',
        fontFamily: 'Playfair Display',
        usedIn: ['restaurant app', 'food delivery', 'menu page'],
    },

    foodDelivery: {
        name: 'Food Delivery / Fast',
        background: '#0a0a0b',
        surface: '#111118',
        primary: '#f97316', // orange
        secondary: '#ef4444',
        accent: '#fbbf24',
        text: '#ffffff',
        textMuted: '#9ca3af',
        fontFamily: 'Inter',
        usedIn: ['food ordering', 'delivery tracking', 'restaurant listing'],
    },

    travel: {
        name: 'Travel / Exploration',
        background: '#fdf8f6',
        surface: '#ffffff',
        primary: '#f59e0b', // amber
        secondary: '#ef4444',
        accent: '#3b82f6',
        text: '#111827',
        textMuted: '#6b7280',
        fontFamily: 'Inter',
        usedIn: ['travel planner', 'booking app', 'hotel listing'],
    },

    education: {
        name: 'Education / EdTech',
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#2563eb', // blue
        secondary: '#7c3aed',
        accent: '#10b981',
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e2e8f0',
        fontFamily: 'Inter',
        usedIn: ['course platform', 'lesson player', 'quiz app'],
    },

    realEstate: {
        name: 'Real Estate / Property',
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#0ea5e9', // sky blue
        secondary: '#10b981',
        accent: '#6366f1',
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e2e8f0',
        fontFamily: 'Inter',
        usedIn: ['property listing', 'map search', 'agent profile'],
    },

    nft: {
        name: 'NFT / Web3',
        background: '#000000',
        surface: '#111827',
        primary: '#7c3aed', // violet
        secondary: '#db2777',
        accent: '#a78bfa',
        gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
        text: '#ffffff',
        textMuted: '#9ca3af',
        glow: 'rgba(124,58,237,0.3)',
        fontFamily: 'Inter',
        usedIn: ['NFT marketplace', 'crypto art', 'digital collectibles'],
    },

    music: {
        name: 'Music / Audio',
        background: '#191414', // Spotify-like
        surface: '#282828',
        primary: '#1db954', // Spotify green
        secondary: '#a855f7',
        accent: '#ec4899',
        text: '#ffffff',
        textMuted: '#b3b3b3',
        fontFamily: 'Inter',
        usedIn: ['music player', 'podcast app', 'audio streaming'],
    },

    aiSaas: {
        name: 'AI / SaaS / Tech',
        background: '#020617',
        surface: '#0f172a',
        surfaceAlt: '#1e293b',
        primary: '#38bdf8', // sky
        secondary: '#a855f7',
        accent: '#6366f1',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        fontFamily: 'Inter',
        usedIn: ['AI landing page', 'SaaS dashboard', 'developer tool'],
    },

    brutalist: {
        name: 'Brutalist / Bold',
        background: '#ffffff',
        surface: '#f3f4f6',
        primary: '#facc15', // yellow
        secondary: '#000000',
        accent: '#ef4444',
        text: '#000000',
        textMuted: '#374151',
        fontFamily: 'monospace',
        borderStyle: '4px solid #000000',
        shadow: '8px 8px 0px #000000',
        radius: '0px',
        usedIn: ['agency portfolio', 'brutalist landing', 'art portfolio'],
    },

    glass: {
        name: 'Glassmorphism',
        background: 'linear-gradient(135deg, #1e1b4b, #000000)',
        surface: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        primary: '#6366f1',
        secondary: '#ec4899',
        text: '#ffffff',
        textMuted: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Inter',
        usedIn: ['premium auth', 'glass card', 'overlay panels'],
        dartPattern: `Container(
  decoration: BoxDecoration(
    color: Colors.white.withOpacity(0.05),
    borderRadius: BorderRadius.circular(24.0),
    border: Border.all(color: Colors.white.withOpacity(0.1)),
  ),
  child: BackdropFilter(
    filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
    child: /* content */,
  ),
)`,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: COMMON FLUTTER PATTERNS LIBRARY
// Production-ready patterns for the most common app requirements.
// ─────────────────────────────────────────────────────────────────────────────

const FLUTTER_PATTERNS = {

    authFlow: `// Complete Auth State Management Pattern:
class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: Supabase.instance.client.auth.onAuthStateChange,
      builder: (context, snapshot) {
        if (snapshot.hasData && snapshot.data!.session != null) {
          return const HomePage();
        }
        return const LoginPage();
      },
    );
  }
}`,

    formValidation: `// Form with validation:
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        validator: (value) {
          if (value == null || value.isEmpty) return 'Required';
          if (!RegExp(r'^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}\$').hasMatch(value)) {
            return 'Enter a valid email';
          }
          return null;
        },
        decoration: const InputDecoration(labelText: 'Email'),
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            // form is valid, proceed
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)`,

    pullToRefresh: `RefreshIndicator(
  color: const Color(0xFF6366F1),
  onRefresh: () async {
    await fetchData(); // your async fetch function
  },
  child: ListView.builder(
    physics: const AlwaysScrollableScrollPhysics(),
    itemCount: items.length,
    itemBuilder: (context, index) => ItemCard(item: items[index]),
  ),
)`,

    infiniteScroll: `NotificationListener<ScrollNotification>(
  onNotification: (notification) {
    if (notification is ScrollEndNotification &&
        notification.metrics.extentAfter < 200) {
      _loadMoreItems(); // fetch next page
    }
    return false;
  },
  child: ListView.builder(
    itemCount: items.length + (isLoading ? 1 : 0),
    itemBuilder: (context, index) {
      if (index == items.length) {
        return const Center(child: CircularProgressIndicator());
      }
      return ItemCard(item: items[index]);
    },
  ),
)`,

    imageUpload: `// Pick image and upload to Supabase Storage:
import 'package:image_picker/image_picker.dart';

Future<String?> uploadAvatar() async {
  final ImagePicker picker = ImagePicker();
  final XFile? image = await picker.pickImage(
    source: ImageSource.gallery,
    maxWidth: 512,
    maxHeight: 512,
    imageQuality: 80,
  );

  if (image == null) return null;

  final bytes = await image.readAsBytes();
  final path = 'avatars/\${supabase.auth.currentUser!.id}/avatar.jpg';

  await supabase.storage.from('avatars').uploadBinary(
    path,
    bytes,
    fileOptions: const FileOptions(upsert: true, contentType: 'image/jpeg'),
  );

  return supabase.storage.from('avatars').getPublicUrl(path);
}`,

    snackbar: `// Show different snackbar types:
void showSuccess(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: const Color(0xFF10B981),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ),
  );
}

void showError(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: const Color(0xFFEF4444),
      behavior: SnackBarBehavior.floating,
    ),
  );
}`,

    dialog: `// Show a confirmation dialog:
final bool? confirmed = await showDialog<bool>(
  context: context,
  builder: (context) => AlertDialog(
    backgroundColor: const Color(0xFF1E293B),
    title: const Text('Confirm', style: TextStyle(color: Colors.white)),
    content: const Text(
      'Are you sure you want to delete this item?',
      style: TextStyle(color: Color(0xFF94A3B8)),
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context, false),
        child: const Text('Cancel'),
      ),
      ElevatedButton(
        onPressed: () => Navigator.pop(context, true),
        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
        child: const Text('Delete'),
      ),
    ],
  ),
);
if (confirmed == true) { /* delete */ }`,

    bottomSheet: `// Show a bottom sheet:
showModalBottomSheet(
  context: context,
  isScrollControlled: true,
  backgroundColor: const Color(0xFF1E293B),
  shape: const RoundedRectangleBorder(
    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
  ),
  builder: (context) => DraggableScrollableSheet(
    expand: false,
    maxChildSize: 0.85,
    minChildSize: 0.3,
    initialChildSize: 0.5,
    builder: (context, scrollController) => ListView(
      controller: scrollController,
      padding: const EdgeInsets.all(24),
      children: [/* content */],
    ),
  ),
);`,

    loadingOverlay: `// Full-screen loading overlay:
Stack(
  children: [
    /* main content */,
    if (isLoading)
      Container(
        color: Colors.black54,
        child: const Center(
          child: CircularProgressIndicator(color: Color(0xFF6366F1)),
        ),
      ),
  ],
)`,

    animations: `// Fade + slide entry animation:
import 'package:flutter/material.dart';

// Use AnimatedOpacity for fade:
AnimatedOpacity(
  opacity: _visible ? 1.0 : 0.0,
  duration: const Duration(milliseconds: 400),
  child: /* widget */,
)

// Use AnimatedContainer for size/color transitions:
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeOutCubic,
  width: isExpanded ? 200.0 : 80.0,
  decoration: BoxDecoration(
    color: isSelected ? const Color(0xFF6366F1) : const Color(0xFF1E293B),
    borderRadius: BorderRadius.circular(12.0),
  ),
  child: /* content */,
)

// Use TweenAnimationBuilder for custom values:
TweenAnimationBuilder<double>(
  tween: Tween(begin: 0.0, end: 1.0),
  duration: const Duration(milliseconds: 600),
  curve: Curves.easeOutBack,
  builder: (context, value, child) => Transform.scale(
    scale: value,
    child: child,
  ),
  child: /* widget */,
)`,
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: DART LANGUAGE RULES FOR AI
// Key Dart 3.x rules the AI must follow when generating code.
// ─────────────────────────────────────────────────────────────────────────────

const DART_RULES = `
DART 3.x / NULL-SAFETY RULES (strictly enforce these):

1. NULL SAFETY:
   ✓ Use ?. for nullable access: user?.email
   ✓ Use ?? for fallbacks: user?.name ?? 'Guest'
   ✓ Use ! only when you 100% know the value is non-null
   ✗ Never use ! on data from API responses — they can be null
   ✗ Never chain ! operators: data!.user!.name (crash waiting to happen)

2. TYPE SAFETY:
   ✓ Always cast API Map values: data['price'] as double? ?? 0.0
   ✓ Use jsonDecode carefully — always cast the result type
   ✓ Prefer final over var for values that don't change
   ✗ Never assume dynamic types — always cast

3. ASYNC/AWAIT:
   ✓ Always await async calls inside async functions
   ✓ Always use try-catch around await calls
   ✓ Return Future<void> for async void functions
   ✓ Use mounted check after await before using context:
     await someAsyncCall();
     if (!mounted) return; // safety check
     Navigator.pushNamed(context, '/home');

4. CONST:
   ✓ Add const to widgets that never change: const Text('Hello')
   ✓ Add const to constructors when all fields are final
   ✓ const SizedBox() instead of SizedBox()
   ✓ const EdgeInsets.all(16) instead of EdgeInsets.all(16)

5. STRINGS:
   ✓ Use single quotes: 'Hello World'
   ✓ Escape dollar signs in strings: 'Price: \\$10'
   ✓ Use string interpolation: 'Hello \${name}!'
   ✗ Never use dollar sign directly in string literals that go to Dart

6. WIDGET LIFECYCLE:
   ✓ initState() for one-time setup
   ✓ dispose() to clean up controllers, streams, timers
   ✓ setState() only for local widget state
   ✓ AppState.instance.updateX() for shared app state

7. PERFORMANCE:
   ✓ const constructors wherever possible
   ✓ ListView.builder instead of ListView with children list
   ✓ Use Keys when reordering lists
   ✓ Avoid rebuilding heavy widgets — extract to separate StatelessWidget
   ✓ Use RepaintBoundary for complex animations
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: PUBSPEC DEPENDENCY RESOLVER
// Automatically determines which packages a schema needs.
// ─────────────────────────────────────────────────────────────────────────────

const DEPENDENCY_MAP = {
    MapView: { package: 'google_maps_flutter', version: '^2.6.1', platforms: ['android', 'ios'] },
    WebView: { package: 'webview_flutter', version: '^4.7.0', platforms: ['android', 'ios'] },
    VideoPlayer: { package: 'video_player', version: '^2.8.3', platforms: ['android', 'ios', 'web'] },
    ImagePicker: { package: 'image_picker', version: '^1.1.2', platforms: ['android', 'ios'] },
    supabase: { package: 'supabase_flutter', version: '^2.3.4', platforms: ['all'] },
    firebase: { packages: ['firebase_core:^2.27.0', 'firebase_auth:^4.17.0', 'cloud_firestore:^4.15.0'] },
    always: [
        { package: 'http', version: '^1.2.0' },
        { package: 'flutter_dotenv', version: '^5.1.0' },
        { package: 'provider', version: '^6.1.2' },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: SCHEMA SCANNER
// Inspects the AppForge schema to extract precise context for the prompt.
// ─────────────────────────────────────────────────────────────────────────────

const scanSchema = (schema) => {
    const widgetTypes = new Set();
    const boundVars = new Set();
    const actionTypes = new Set();
    const navTargets = new Set();
    const apiEndpoints = [];
    const stateVarMap = {};

    const walk = (node) => {
        if (!node) return;
        widgetTypes.add(node.type);

        const p = node.props || {};

        // State bindings
        if (p.isBound && p.boundVariable) boundVars.add(p.boundVariable);

        // Actions
        if (p.actionType && p.actionType !== 'none') actionTypes.add(p.actionType);
        if (p.actionChain) {
            p.actionChain.forEach(a => {
                actionTypes.add(a.type);
                if (a.target) navTargets.add(a.target);
                if (a.url) apiEndpoints.push({ url: a.url, method: a.method || 'GET' });
            });
        }

        (node.children || []).forEach(walk);
    };

    (schema.pages || []).forEach(p => walk(p.root));

    // Build state var map
    (schema.appState || []).forEach(s => {
        stateVarMap[s.key] = { type: s.type, defaultValue: s.value };
    });

    return {
        widgetTypes: [...widgetTypes],
        boundVars: [...boundVars],
        actionTypes: [...actionTypes],
        navTargets: [...navTargets],
        apiEndpoints,
        stateVarMap,
        pageCount: schema.pages?.length || 0,
        tableCount: schema.appConfig?.dbTables?.length || 0,
        hasBottomNav: schema.appConfig?.enableBottomNav || false,
        backend: schema.backendProvider || 'supabase',
        hasSupabase: !!(schema.supabaseConfig?.url?.length > 5),
        hasFirebase: schema.backendProvider === 'firebase',
        hasApiCalls: apiEndpoints.length > 0,
        usesMap: [...widgetTypes].includes('MapView'),
        usesWebView: [...widgetTypes].includes('WebView'),
        usesVideo: [...widgetTypes].includes('VideoPlayer'),
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: THEME MATCHER
// Matches the schema's color palette to the closest named store theme.
// ─────────────────────────────────────────────────────────────────────────────

const matchTheme = (schema) => {
    const bg = schema.theme?.background?.toLowerCase() || '#000000';
    const primary = schema.theme?.primary?.toLowerCase() || '#3b82f6';

    // Simple heuristic matcher
    const isDark = bg.startsWith('#0') || bg.startsWith('#1') || bg === '#000000';
    const isWhite = bg === '#ffffff' || bg.startsWith('#f');

    if (primary.includes('1db954') || primary.includes('10b981')) return STORE_THEMES.music;
    if (primary.includes('f97316') || primary.includes('ef4444')) return STORE_THEMES.foodDelivery;
    if (primary.includes('ec4899') && isWhite) return STORE_THEMES.ecommerce;
    if (primary.includes('06b6d4') && isWhite) return STORE_THEMES.healthcare;
    if (primary.includes('7c3aed') || primary.includes('a855f7')) return STORE_THEMES.nft;
    if (primary.includes('facc15')) return STORE_THEMES.brutalist;
    if (primary.includes('38bdf8') || primary.includes('0ea5e9')) return STORE_THEMES.aiSaas;
    if (primary.includes('f59e0b') && isWhite) return STORE_THEMES.travel;
    if (primary.includes('2563eb') && isWhite) return STORE_THEMES.education;
    if (isDark && primary.includes('10b981')) return STORE_THEMES.fitness;
    if (isWhite) return STORE_THEMES.ecommerce;

    return STORE_THEMES.darkTech; // default
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: compileFlutterContext(schema, task, options)
//
// schema  — your AppForge schema object
// task    — string describing what you want Gemini to do
// options — { includeThemes, includeBackend, includePatterns, focusWidgets, verbosity }
// ─────────────────────────────────────────────────────────────────────────────

export const compileFlutterContext = (schema, task, options = {}) => {
    const {
        includeThemes = true,
        includeBackend = true,
        includePatterns = true,
        focusWidgets = null,  // array of widget types to include docs for, null = auto
        verbosity = 'full', // 'full' | 'compact' | 'minimal'
    } = options;

    const scan = scanSchema(schema);
    const matchedTheme = matchTheme(schema);
    const backendType = scan.backend;

    // Determine which widgets to document (auto = all widgets found in schema)
    const widgetsToDocument = focusWidgets
        ? focusWidgets
        : scan.widgetTypes.filter(t => WIDGET_KNOWLEDGE[t]);

    // ── BUILD CONTEXT SECTIONS ──────────────────────────────────────────────

    // 1. Identity block
    const identityBlock = `You are AppForge Flutter Intelligence — an expert Flutter 3.19 / Dart 3.3 / ${backendType === 'firebase' ? 'Firebase' : 'Supabase'} engineer.
You have FULL knowledge of the AppForge widget system, design tokens, state management pattern, and backend integration layer.
You output ONLY valid, production-ready Dart code that compiles without errors.
You ALWAYS follow null-safety, const-correctness, and the AppState singleton pattern.`;

    // 2. Task block
    const taskBlock = `═══════════════════════════════
TASK: ${task}
═══════════════════════════════`;

    // 3. App context block
    const appContextBlock = `
APP CONTEXT:
  Name:           ${schema.app?.name || 'AppForge Project'}
  Backend:        ${backendType === 'firebase' ? 'Firebase (Firestore + Auth)' : 'Supabase (PostgreSQL + Auth)'}
  Screens:        ${schema.pages?.map(p => `${p.name} (id: ${p.id})`).join(', ')}
  Widget types:   ${scan.widgetTypes.join(', ')}
  State vars:     ${Object.keys(scan.stateVarMap).length > 0 ? Object.entries(scan.stateVarMap).map(([k, v]) => `${k}: ${v.type} = ${v.defaultValue}`).join(', ') : 'none'}
  DB tables:      ${schema.appConfig?.dbTables?.map(t => `${t.name}(${t.columns?.map(c => `${c.name}:${c.type}`).join(', ')})`).join(', ') || 'none'}
  Bottom nav:     ${scan.hasBottomNav ? 'enabled' : 'disabled'}
  API endpoints:  ${schema.apiEndpoints?.map(e => `${e.method} ${e.url}`).join(', ') || 'none'}
  Uses Map:       ${scan.usesMap}
  Uses WebView:   ${scan.usesWebView}
  Uses Video:     ${scan.usesVideo}
  Active theme:   ${matchedTheme.name}

THEME TOKENS (use EXACTLY these values):
  Background:   ${schema.theme?.background}
  Primary:      ${schema.theme?.primary}
  Secondary:    ${schema.theme?.secondary || matchedTheme.secondary}
  Surface:      ${matchedTheme.surface}
  Text:         ${matchedTheme.text}
  Text muted:   ${matchedTheme.textMuted}
  Font:         ${schema.theme?.fontFamily || matchedTheme.fontFamily || 'Inter'}
  Radius:       ${schema.theme?.globalRadius || matchedTheme.radius || '12px'}`;

    // 4. Supabase config (if applicable)
    const supabaseConfigBlock = scan.hasSupabase ? `
SUPABASE CONFIG (already initialized in main.dart — use Supabase.instance.client directly):
  URL:     ${schema.supabaseConfig?.url || '[from .env SUPABASE_URL]'}
  Tables:  ${schema.appConfig?.dbTables?.map(t => t.name).join(', ') || 'none defined'}
  RLS:     ${schema.appConfig?.dbTables?.some(t => t.rlsEnabled) ? 'enabled on some tables' : 'disabled'}` : '';

    // 5. Firebase config (if applicable)
    const firebaseConfigBlock = scan.hasFirebase ? `
FIREBASE CONFIG (already initialized in main.dart — use FirebaseAuth.instance and FirebaseFirestore.instance directly):
  Project: ${schema.firebaseConfig?.projectId || '[from .env FIREBASE_PROJECT_ID]'}` : '';

    // 6. Dart rules block
    const dartRulesBlock = verbosity !== 'minimal' ? DART_RULES : `
DART RULES: null-safety mandatory, const everywhere possible, try-catch all async, check mounted after await.`;

    // 7. State management block
    const stateBlock = Object.keys(scan.stateVarMap).length > 0
        ? `
APPSTATE SINGLETON (already defined — DO NOT redefine, just use it):
${Object.entries(scan.stateVarMap).map(([key, v]) =>
            `  AppState.instance.${key}           // getter: ${v.type}
  AppState.instance.update${key.charAt(0).toUpperCase() + key.slice(1)}(val) // setter`
        ).join('\n')}

Read:   AppState.instance.someVar
Write:  AppState.instance.updateSomeVar(newValue)
React:  ListenableBuilder(listenable: AppState.instance, builder: (ctx, _) => Text(AppState.instance.someVar))`
        : '';

    // 8. Navigation block
    const navBlock = scan.pageCount > 1 ? `
NAVIGATION (named routes already registered):
${schema.pages?.map(p => `  '/${p.id}' → ${p.name}`).join('\n')}

Push:    Navigator.pushNamed(context, '/${scan.navTargets[0] || 'page_id'}');
Replace: Navigator.pushReplacementNamed(context, '/page_id');
Pop:     Navigator.pop(context);` : '';

    // 9. Widget docs block (focused on widgets actually in the schema)
    let widgetDocsBlock = '';
    if (verbosity === 'full' && widgetsToDocument.length > 0) {
        widgetDocsBlock = '\nWIDGET REFERENCE (AppForge widget system):';
        widgetsToDocument.slice(0, 8).forEach(type => {
            const w = WIDGET_KNOWLEDGE[type];
            if (!w) return;
            widgetDocsBlock += `\n\n── ${type} ──
Description: ${w.description}
Dart class: ${w.dartClass}
${w.pitfalls ? `Pitfalls: ${w.pitfalls[0]}` : ''}
Pattern:
\`\`\`dart
${w.dartPattern?.trim().slice(0, 400)}
\`\`\``;
        });
    }

    // 10. Backend query block (focused on detected action types)
    let backendBlock = '';
    if (includeBackend && verbosity !== 'minimal') {
        const backend = BACKEND_KNOWLEDGE[backendType === 'firebase' ? 'firebase' : 'supabase'];
        if (backend) {
            backendBlock = `\nBACKEND PATTERNS (${backendType}):`;

            // Always include auth and select patterns
            if (backendType === 'firebase') {
                backendBlock += `\n\nAUTH:\n\`\`\`dart\n${backend.auth.signIn.trim()}\n\`\`\``;
                backendBlock += `\n\nFIRESTORE READ:\n\`\`\`dart\n${backend.firestore.select.trim().slice(0, 500)}\n\`\`\``;
                if (scan.actionTypes.includes('firebaseInsert') || scan.actionTypes.includes('supabase')) {
                    backendBlock += `\n\nFIRESTORE WRITE:\n\`\`\`dart\n${backend.firestore.insert.trim()}\n\`\`\``;
                }
                if (scan.hasFirebase) {
                    backendBlock += `\n\nREALTIME:\n\`\`\`dart\n${backend.firestore.realtime.trim().slice(0, 400)}\n\`\`\``;
                }
            } else {
                backendBlock += `\n\nAUTH:\n\`\`\`dart\n${backend.auth.signIn.trim()}\n\`\`\``;
                backendBlock += `\n\nQUERY:\n\`\`\`dart\n${backend.database.select.trim().slice(0, 500)}\n\`\`\``;
                if (scan.actionTypes.includes('supabaseInsert') || scan.actionTypes.includes('supabase')) {
                    backendBlock += `\n\nINSERT:\n\`\`\`dart\n${backend.database.insert.trim()}\n\`\`\``;
                }
                if (scan.hasSupabase) {
                    backendBlock += `\n\nERROR HANDLING:\n\`\`\`dart\n${backend.errorHandling.trim()}\n\`\`\``;
                }
            }

            // REST API if action chains have api type
            if (scan.actionTypes.includes('api') || scan.apiEndpoints.length > 0) {
                backendBlock += `\n\nREST API:\n\`\`\`dart\n${BACKEND_KNOWLEDGE.restApi.get.trim().slice(0, 400)}\n\`\`\``;
            }
        }
    }

    // 11. Theme knowledge block (always useful for styling tasks)
    let themeBlock = '';
    if (includeThemes) {
        const theme = matchedTheme;
        themeBlock = `
ACTIVE THEME: ${theme.name}
Common usage:
  Primary color:  Color(0xFF${(schema.theme?.primary || theme.primary).replace('#', '')})
  Background:     Color(0xFF${(schema.theme?.background || theme.background).replace('#', '').replace('0', '050609').slice(0, 6)})
  Surface card:   Color(0xFF${(theme.surface || '#1E293B').replace('#', '')})
  Text primary:   ${theme.text === '#ffffff' ? 'Colors.white' : 'Color(0xFF' + (theme.text || '#0F172A').replace('#', '') + ')'}
  Text muted:     Color(0xFF${(theme.textMuted || '#94A3B8').replace('#', '')})
  Border:         Colors.white.withOpacity(0.08)
  Success:        const Color(0xFF22C55E)
  Error:          const Color(0xFFEF4444)
  Warning:        const Color(0xFFF59E0B)

This matches the "${theme.name}" design system used in: ${theme.usedIn?.join(', ')}.`;

        // Add glass pattern if theme uses glassmorphism
        if (scan.actionTypes.includes('glass') || theme.name.includes('Glass')) {
            themeBlock += `\n\nGLASS CARD PATTERN:\n\`\`\`dart\n${STORE_THEMES.glass.dartPattern}\n\`\`\``;
        }
    }

    // 12. Common patterns (only if task seems relevant)
    let patternsBlock = '';
    if (includePatterns && verbosity === 'full') {
        const taskLower = task.toLowerCase();
        const patterns = [];

        if (taskLower.includes('auth') || taskLower.includes('login') || taskLower.includes('sign'))
            patterns.push(['AUTH WRAPPER', FLUTTER_PATTERNS.authFlow]);
        if (taskLower.includes('form') || taskLower.includes('input') || taskLower.includes('valid'))
            patterns.push(['FORM VALIDATION', FLUTTER_PATTERNS.formValidation]);
        if (taskLower.includes('list') || taskLower.includes('feed') || taskLower.includes('scroll'))
            patterns.push(['INFINITE SCROLL', FLUTTER_PATTERNS.infiniteScroll]);
        if (taskLower.includes('pull') || taskLower.includes('refresh'))
            patterns.push(['PULL TO REFRESH', FLUTTER_PATTERNS.pullToRefresh]);
        if (taskLower.includes('upload') || taskLower.includes('image') || taskLower.includes('photo'))
            patterns.push(['IMAGE UPLOAD', FLUTTER_PATTERNS.imageUpload]);
        if (taskLower.includes('dialog') || taskLower.includes('confirm') || taskLower.includes('delete'))
            patterns.push(['DIALOG', FLUTTER_PATTERNS.dialog]);
        if (taskLower.includes('sheet') || taskLower.includes('bottom') || taskLower.includes('modal'))
            patterns.push(['BOTTOM SHEET', FLUTTER_PATTERNS.bottomSheet]);
        if (taskLower.includes('toast') || taskLower.includes('snack') || taskLower.includes('notification'))
            patterns.push(['SNACKBAR', FLUTTER_PATTERNS.snackbar]);
        if (taskLower.includes('anim') || taskLower.includes('transition') || taskLower.includes('motion'))
            patterns.push(['ANIMATIONS', FLUTTER_PATTERNS.animations]);
        if (taskLower.includes('load') || taskLower.includes('spinner') || taskLower.includes('wait'))
            patterns.push(['LOADING OVERLAY', FLUTTER_PATTERNS.loadingOverlay]);

        if (patterns.length > 0) {
            patternsBlock = '\nRELEVANT PATTERNS:';
            patterns.slice(0, 3).forEach(([label, code]) => {
                patternsBlock += `\n\n── ${label} ──\n\`\`\`dart\n${code.trim().slice(0, 600)}\n\`\`\``;
            });
        }
    }

    // 13. Output format instructions
    const outputBlock = `
OUTPUT REQUIREMENTS:
  - Output ONLY valid Dart/Flutter code
  - No markdown explanation text — code only (unless explaining an error)
  - Use const wherever possible
  - Follow null-safety strictly (no ! unless provably non-null)
  - Match the color tokens above EXACTLY — no hardcoded colors unless specified
  - Use the AppState singleton for any state, not setState() in StatefulWidget
  - All async operations must have try-catch blocks
  - Check mounted after every await that precedes a context usage
  - Import only packages that are in the dependency list`;

    // ── ASSEMBLE FINAL PROMPT ────────────────────────────────────────────────

    const sections = [
        identityBlock,
        taskBlock,
        appContextBlock,
        supabaseConfigBlock,
        firebaseConfigBlock,
        stateBlock,
        navBlock,
        widgetDocsBlock,
        backendBlock,
        themeBlock,
        patternsBlock,
        dartRulesBlock,
        outputBlock,
    ].filter(Boolean).join('\n');

    return sections;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: compileRepairContext(schema, errorLogs, task)
// Specialized context for AI repair tasks — includes error analysis.
// ─────────────────────────────────────────────────────────────────────────────

export const compileRepairContext = (schema, errorLogs, task = 'Fix the build error') => {
    const base = compileFlutterContext(schema, task, {
        includeThemes: false,
        includePatterns: false,
        verbosity: 'compact',
    });

    const errorBlock = `
BUILD ERRORS TO FIX:
\`\`\`
${errorLogs.slice(0, 3000)}
\`\`\`

REPAIR INSTRUCTIONS:
1. Identify the ROOT CAUSE — not just the symptom
2. Output the MINIMAL code change that fixes it
3. Do not refactor unrelated code
4. If it's an import issue, output the exact import line
5. If it's a type mismatch, output the fixed cast
6. If it's a null-safety issue, output the safe accessor
7. Format your response as:
   ROOT CAUSE: [one sentence]
   FIX: [the corrected code block only]
   EXPLANATION: [one sentence why this fixes it]`;

    return base + errorBlock;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: compileBackendContext(schema, task)
// Focused context for pure backend/SQL/API generation tasks.
// ─────────────────────────────────────────────────────────────────────────────

export const compileBackendContext = (schema, task) => {
    const scan = scanSchema(schema);
    const backendType = scan.backend;
    const backend = BACKEND_KNOWLEDGE[backendType === 'firebase' ? 'firebase' : 'supabase'];

    return `You are a ${backendType === 'firebase' ? 'Firebase/Firestore' : 'Supabase/PostgreSQL'} backend engineer.
You output ONLY valid backend code, SQL, or API configurations.

TASK: ${task}

DATABASE SCHEMA:
${schema.appConfig?.dbTables?.map(t =>
        `Table: ${t.name}
  Columns: id (uuid, PK), created_at (timestamp), ${t.columns?.map(c => `${c.name} (${c.type})`).join(', ')}
  RLS enabled: ${t.rlsEnabled ? 'yes' : 'no'}
  Auth-only writes: ${t.rlsAuthOnly ? 'yes' : 'no'}`
    ).join('\n\n') || 'No tables defined'}

STATE VARIABLES (available for bindings):
${Object.entries(scanSchema(schema).stateVarMap).map(([k, v]) => `  ${k}: ${v.type}`).join('\n') || 'none'}

BACKEND REFERENCE:
\`\`\`dart
${Object.values(backend?.database || backend?.firestore || {}).join('\n\n').slice(0, 2000)}
\`\`\`

OUTPUT: Valid ${backendType === 'firebase' ? 'Dart/Firestore' : 'Dart/Supabase or PostgreSQL SQL'} code only.`;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: compileThemeContext(schema, themeName, task)
// Focused context for UI theming and visual design tasks.
// ─────────────────────────────────────────────────────────────────────────────

export const compileThemeContext = (schema, task) => {
    const matchedTheme = matchTheme(schema);
    const allThemeNames = Object.entries(STORE_THEMES)
        .map(([key, t]) => `  ${key}: ${t.name} — ${t.usedIn?.join(', ')}`)
        .join('\n');

    return `You are an AppForge UI/UX design engineer specializing in Flutter theming.
You output ONLY valid Dart/Flutter theme code and color schemes.

TASK: ${task}

CURRENT THEME: ${matchedTheme.name}
  Primary:    ${schema.theme?.primary}
  Background: ${schema.theme?.background}
  Secondary:  ${schema.theme?.secondary || matchedTheme.secondary}

ALL AVAILABLE APPFORGE THEMES:
${allThemeNames}

THEME TOKEN USAGE IN DART:
\`\`\`dart
// Primary color:
Color(0xFF${(schema.theme?.primary || '#3B82F6').replace('#', '')})

// Surface card (matches current theme surface):
Color(0xFF${(matchedTheme.surface || '#1E293B').replace('#', '')})

// Gradient (current theme):
${matchedTheme.dartGradient || `LinearGradient(
  colors: [Color(0xFF${(schema.theme?.primary || '#6366F1').replace('#', '')}),
           Color(0xFF${(schema.theme?.secondary || 'EC4899').replace('#', '')})],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
)`}

// Glass effect:
${STORE_THEMES.glass.dartPattern}
\`\`\`

OUTPUT: A complete ThemeData object or the specific styled widget requested.
Always use const Color() for static colors. Never use Colors.blue directly.`;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: compileIconContext()
// Returns the full Lucide → Material icon mapping for icon-related tasks.
// ─────────────────────────────────────────────────────────────────────────────

export const compileIconContext = () => {
    const iconEntries = Object.entries(WIDGET_KNOWLEDGE.Icon.lucideToMaterialExamples)
        .map(([lucide, material]) => `  ${lucide} → ${material}`)
        .join('\n');

    return `LUCIDE TO MATERIAL ICON MAPPING (AppForge uses this exact mapping):
${iconEntries}

RULE: Always use _rounded variants when available (Icons.home_rounded, not Icons.home).
RULE: If a Lucide name has no direct match, convert snake_case and try Icons.name_rounded.
RULE: Fall back to Icons.help_outline_rounded if nothing matches.`;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: getDependencies(schema)
// Returns the pubspec.yaml dependencies block for this schema.
// ─────────────────────────────────────────────────────────────────────────────

export const getDependencies = (schema) => {
    const scan = scanSchema(schema);
    const deps = { ...Object.fromEntries(DEPENDENCY_MAP.always.map(d => [d.package, d.version])) };

    if (scan.hasSupabase) deps['supabase_flutter'] = '^2.3.4';
    if (scan.hasFirebase) {
        deps['firebase_core'] = '^2.27.0';
        deps['firebase_auth'] = '^4.17.0';
        deps['cloud_firestore'] = '^4.15.0';
    }
    if (scan.usesMap) deps['google_maps_flutter'] = '^2.6.1';
    if (scan.usesWebView) deps['webview_flutter'] = '^4.7.0';
    if (scan.usesVideo) deps['video_player'] = '^2.8.3';

    return `dependencies:
  flutter:
    sdk: flutter
${Object.entries(deps).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT: Full compiler + all helpers
// ─────────────────────────────────────────────────────────────────────────────

export default {
    compileFlutterContext,
    compileRepairContext,
    compileBackendContext,
    compileThemeContext,
    compileIconContext,
    getDependencies,
    // Raw knowledge bases (useful for building custom prompts)
    WIDGET_KNOWLEDGE,
    BACKEND_KNOWLEDGE,
    STORE_THEMES,
    FLUTTER_PATTERNS,
    DART_RULES,
    DEPENDENCY_MAP,
};
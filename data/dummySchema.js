export const dummySchema = {
  theme: {
    primary: "#FF4500",
    background: "#121212",
    globalRadius: "12px"
  },
  app: {
    initialPage: "page_1"
  },
  pages: [
    {
      id: "page_1",
      name: "Login Screen",
      root: {
        id: "root_column_1",
        type: "Column",
        props: { padding: "16px", gap: "16px", mainAxisAlignment: "center", crossAxisAlignment: "stretch" },
        children: [
          { id: "text_title", type: "Text", props: { content: "AppForge", fontSize: "32px", fontWeight: "bold", color: "#FFFFFF", textAlign: "center" } },
          { id: "btn_login", type: "Button", props: { label: "Login", backgroundColor: "theme.primary", color: "#FFFFFF", borderRadius: "8px", action: "navigate", targetPage: "page_2" } }
        ]
      }
    },
    {
      id: "page_2",
      name: "Home Screen",
      root: {
        id: "root_column_2",
        type: "Column",
        props: { padding: "16px", gap: "16px", mainAxisAlignment: "start", crossAxisAlignment: "stretch" },
        children: [
          { id: "text_welcome", type: "Text", props: { content: "Welcome Home!", fontSize: "24px", color: "#FFFFFF", textAlign: "left" } },
          { id: "btn_back", type: "Button", props: { label: "Log Out", backgroundColor: "#333333", color: "#FFFFFF", action: "navigate", targetPage: "page_1" } }
        ]
      }
    }
  ]
};
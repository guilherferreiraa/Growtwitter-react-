import { SideBar } from "../components/SideBar";

export function Search() {
  const isDarkMode = true;
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const theme = {
    bg: isDarkMode ? "#000" : "#fff",
    text: isDarkMode ? "#e7e9ea" : "#0f1419",
    border: isDarkMode ? "#2f3336" : "#eff3f4",
    card: isDarkMode ? "#16181c" : "#f7f9f9",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      <SideBar loggedUser={loggedUser} theme={theme} />

      <main
        style={{ width: "600px", borderRight: `1px solid ${theme.border}` }}
      >
        <header
          style={{
            padding: "15px",
            borderBottom: `1px solid ${theme.border}`,
            position: "sticky",
            top: 0,
            backgroundColor: theme.bg,
            zIndex: 10,
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>Explorar</span>
        </header>

        <section style={{ padding: "16px" }}>
          <div
            style={{
              backgroundColor: theme.card,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <h3 style={{ padding: "15px", fontSize: "20px", margin: 0 }}>
              O que está acontecendo
            </h3>

            <div style={{ padding: "15px", cursor: "pointer" }}>
              <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
                Tecnologia · Em alta
              </span>
              <div
                style={{
                  fontWeight: "bold",
                  margin: "2px 0",
                  fontSize: "16px",
                }}
              >
                Prisma 7
              </div>
              <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
                1.200 Tweets
              </span>
            </div>

            <div style={{ padding: "15px", cursor: "pointer" }}>
              <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
                Educação · Em alta
              </span>
              <div
                style={{
                  fontWeight: "bold",
                  margin: "2px 0",
                  fontSize: "16px",
                }}
              >
                Growdev
              </div>
              <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
                tecnologia
              </span>
            </div>

            <div style={{ padding: "15px", cursor: "pointer" }}>
              <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
                Esportes · Em alta
              </span>
            </div>
          </div>
        </section>
      </main>

      <aside style={{ width: "350px", padding: "20px" }} />
    </div>
  );
}

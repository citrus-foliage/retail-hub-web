import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar.jsx";
import Button from "../components/ui/Button.jsx";
import PageTransition from "../components/ui/PageTransition.jsx";

const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0617/9785/9493/files/366510852_813662793580177_6474715850468827193_n.jpg?v=1701872910";

const Landing = () => {
  useEffect(() => {
    document.title = "Home — Retail Hub";
    return () => {
      document.title = "Retail Hub";
    };
  }, []);

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div
          style={{
            borderBottom: "1px solid #E0D8CC",
            padding: "20px 64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#2C2C2C",
              letterSpacing: "0.03em",
              lineHeight: "1.6",
              maxWidth: "560px",
            }}
          >
            Retail Hub is a curated platform for independent designers and
            studios working at the edge of furniture, object, and concept.
          </p>
          <Link
            to="/products"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#8C8070",
              textDecoration: "none",
            }}
          >
            View All Products →
          </Link>
        </div>

        <div style={{ padding: "40px 64px 0" }}>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#8C8070",
            }}
          >
            Featured Designer
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            margin: "16px 64px 0",
            border: "1px solid #E0D8CC",
          }}
        >
          <div
            style={{
              height: "560px",
              overflow: "hidden",
              backgroundColor: "#EDE8DF",
            }}
          >
            <img
              src={HERO_IMAGE}
              alt="Muddycap Collection"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "#FDFAF5",
              padding: "56px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "#8C8070",
                }}
              >
                Now available
              </p>
              <h1
                style={{
                  margin: "0 0 28px 0",
                  fontSize: "42px",
                  fontWeight: "400",
                  color: "#2C2C2C",
                  letterSpacing: "-0.01em",
                  lineHeight: "1.1",
                }}
              >
                Muddycap
              </h1>
              <p
                style={{
                  margin: "0 0 40px 0",
                  fontSize: "14px",
                  color: "#5C5347",
                  lineHeight: "1.8",
                  maxWidth: "380px",
                }}
              >
                Digitally rendered chairs that blur the line between physical
                furniture and digital art. Each piece exists as a singular
                concept — impossible in material, precise in form.
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Link to="/products">
                <Button size="lg" fullWidth>
                  Shop the Collection
                </Button>
              </Link>
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: "#B0A898",
                  letterSpacing: "0.05em",
                  lineHeight: "1.6",
                }}
              >
                All designs are the intellectual property of Muddycap. Featured
                here for educational and portfolio purposes only.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 64px" }}
        >
          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#8C8070",
            }}
          >
            About the Store
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2px",
            }}
          >
            {[
              {
                label: "Curation",
                body: "Retail Hub brings together independent designers whose work challenges what furniture can be — from conceptual 3D studios to emerging craft practices.",
              },
              {
                label: "Concept-first",
                body: "Every piece in the store is chosen for its ideas first. Function matters, but so does the conversation a well-designed object starts when it enters a room.",
              },
              {
                label: "Independent",
                body: "We spotlight designers who operate outside the mainstream — small studios, solo practitioners, and digital-native creators who deserve a wider audience.",
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                style={{
                  backgroundColor: "#FDFAF5",
                  border: "1px solid #E0D8CC",
                  padding: "32px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.25em",
                    color: "#8C8070",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#2C2C2C",
                    lineHeight: "1.7",
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Landing;

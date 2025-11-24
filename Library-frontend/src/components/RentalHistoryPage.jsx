import { useEffect, useState } from "react";
import image from "../img/BookPage.png";

function RentalHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch("https://localhost:7167/api/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }

  const isLateReturn = (dueDate, returnedAt) => {
    return new Date(returnedAt) > new Date(dueDate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysLate = (dueDate, returnedAt) => {
    const due = new Date(dueDate);
    const returned = new Date(returnedAt);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.bookTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "onTime")
      return matchesSearch && !isLateReturn(item.dueDate, item.returnedAt);
    if (filterStatus === "late")
      return matchesSearch && isLateReturn(item.dueDate, item.returnedAt);

    return matchesSearch;
  });

  if (loading) {
    return (
      <div
        className="baground"
        style={{
          backgroundImage: `url(${image})`,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "white", fontSize: 24 }}>Завантаження історії...</p>
      </div>
    );
  }

  return (
    <div
      className="baground"
      style={{
        backgroundImage: `url(${image})`,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "white",
              marginBottom: 10,
            }}
          >
            📚 Історія Оренд
          </h1>
          <p style={{ color: "#ffcc80", fontSize: 18 }}>
            Ваші повернені книги
          </p>
        </div>

        {/* Search and Filter */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 30,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Пошук за назвою книги..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: 300,
                padding: "12px 20px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "2px solid rgba(255, 204, 128, 0.5)",
                borderRadius: 15,
                color: "white",
                fontSize: 16,
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00c6fb")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 204, 128, 0.5)")
              }
            />

            {/* Filters */}
            <button
              onClick={() => setFilterStatus("all")}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  filterStatus === "all"
                    ? "#00c6fb"
                    : "rgba(255, 255, 255, 0.1)",
                color: "white",
                border:
                  filterStatus === "all"
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 15,
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Всі ({history.length})
            </button>

            <button
              onClick={() => setFilterStatus("onTime")}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  filterStatus === "onTime"
                    ? "#4caf50"
                    : "rgba(255, 255, 255, 0.1)",
                color: "white",
                border:
                  filterStatus === "onTime"
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 15,
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Вчасно
            </button>

            <button
              onClick={() => setFilterStatus("late")}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  filterStatus === "late"
                    ? "#f44336"
                    : "rgba(255, 255, 255, 0.1)",
                color: "white",
                border:
                  filterStatus === "late"
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 15,
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Прострочені
            </button>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: 60,
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <p style={{ fontSize: 48, marginBottom: 20 }}>📚</p>
            <h3 style={{ color: "white", fontSize: 24, marginBottom: 10 }}>
              Історія порожня
            </h3>
            <p style={{ color: "#ffcc80", fontSize: 16 }}>
              {searchTerm
                ? "Немає результатів за вашим пошуком"
                : "Ви ще не повернули жодної книги"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {filteredHistory.map((item) => {
              const wasLate = isLateReturn(item.dueDate, item.returnedAt);
              const daysLate = calculateDaysLate(item.dueDate, item.returnedAt);

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 20,
                    padding: 24,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#00c6fb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 20,
                    }}
                  >
                    {/* Book Info */}
                    <div style={{ flex: 1, minWidth: 300 }}>
                      <h3
                        style={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "bold",
                          marginBottom: 20,
                        }}
                      >
                        📖 {item.bookTitle}
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: 16,
                        }}
                      >
                        {/* Borrowed */}
                        <div>
                          <p
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: 12,
                              marginBottom: 4,
                            }}
                          >
                            📅 Взято
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            {formatDate(item.borrowedAt)}
                          </p>
                        </div>

                        {/* Due Date */}
                        <div>
                          <p
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: 12,
                              marginBottom: 4,
                            }}
                          >
                            ⏰ Термін
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            {formatDate(item.dueDate)}
                          </p>
                        </div>

                        {/* Returned */}
                        <div>
                          <p
                            style={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: 12,
                              marginBottom: 4,
                            }}
                          >
                            {wasLate ? "❌" : "✅"} Повернуто
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            {formatDate(item.returnedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      style={{
                        padding: "12px 24px",
                        borderRadius: 15,
                        backgroundColor: wasLate
                          ? "rgba(244, 67, 54, 0.8)"
                          : "rgba(76, 175, 80, 0.8)",
                        border: wasLate
                          ? "2px solid #f44336"
                          : "2px solid #4caf50",
                        textAlign: "center",
                        minWidth: 120,
                      }}
                    >
                      {wasLate ? (
                        <>
                          <p
                            style={{
                              color: "white",
                              fontSize: 14,
                              marginBottom: 4,
                            }}
                          >
                            Прострочено
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 24,
                              fontWeight: "bold",
                            }}
                          >
                            {daysLate} дн.
                          </p>
                        </>
                      ) : (
                        <p
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          ✓ Вчасно
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Border */}
                  <div
                    style={{
                      height: 3,
                      backgroundColor: wasLate ? "#f44336" : "#4caf50",
                      marginTop: 20,
                      borderRadius: 5,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Statistics */}
        {history.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            {/* Total */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: 24,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <p style={{ fontSize: 36, marginBottom: 10 }}>📚</p>
              <p
                style={{ fontSize: 36, fontWeight: "bold", color: "#00c6fb" }}
              >
                {history.length}
              </p>
              <p style={{ color: "#ffcc80", fontSize: 14 }}>
                Всього повернуто
              </p>
            </div>

            {/* On Time */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: 24,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <p style={{ fontSize: 36, marginBottom: 10 }}>✅</p>
              <p
                style={{ fontSize: 36, fontWeight: "bold", color: "#4caf50" }}
              >
                {
                  history.filter(
                    (h) => !isLateReturn(h.dueDate, h.returnedAt)
                  ).length
                }
              </p>
              <p style={{ color: "#ffcc80", fontSize: 14 }}>
                Повернуто вчасно
              </p>
            </div>

            {/* Late */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: 24,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <p style={{ fontSize: 36, marginBottom: 10 }}>⏰</p>
              <p
                style={{ fontSize: 36, fontWeight: "bold", color: "#f44336" }}
              >
                {
                  history.filter((h) => isLateReturn(h.dueDate, h.returnedAt))
                    .length
                }
              </p>
              <p style={{ color: "#ffcc80", fontSize: 14 }}>Прострочено</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RentalHistoryPage;
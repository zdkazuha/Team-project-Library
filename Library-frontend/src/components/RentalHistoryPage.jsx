import { useContext, useEffect, useState } from "react";
import image from "../img/BookPage.png";
import { UserContext } from "../contexts/User.context";
import "../css/RentalHistoryPage.css";

function RentalHistoryPage() {
  const { id } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const API = import.meta.env.VITE_API;
  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const response = await fetch(API + `History?userId=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) { console.error("Error fetching history:", error); }
    finally { setLoading(false); }
  }

  const isLateReturn = (dueDate, returnedAt) => new Date(returnedAt) > new Date(dueDate);
  const formatDate = (date) => new Date(date).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" });
  const calculateDaysLate = (dueDate, returnedAt) => { const diff = Math.ceil((new Date(returnedAt)-new Date(dueDate))/(1000*60*60*24)); return diff>0?diff:0; };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    if(filterStatus==="all") return matchesSearch;
    if(filterStatus==="onTime") return matchesSearch && !isLateReturn(item.dueDate,item.returnedAt);
    if(filterStatus==="late") return matchesSearch && isLateReturn(item.dueDate,item.returnedAt);
    return matchesSearch;
  });

  if (loading) return <div className="baground-rental" style={{backgroundImage:`url(${image})`, display:"flex", justifyContent:"center", alignItems:"center"}}><p style={{color:"white", fontSize:24}}>Завантаження історії...</p></div>;

  return (
    <div className="baground-rental" style={{backgroundImage:`url(${image})`}}>
      <div className="rental-container">

        <div className="rental-header">
          <h1>📚 Історія Оренд</h1>
          <p>Ваші повернені книги</p>
        </div>

        <div className="search-filter">
          <div className="search-filter-inner">
            <input className="search-input" type="text" placeholder="🔍 Пошук за назвою книги..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            <button className={`filter-btn filter-all ${filterStatus==="all"?"active":""}`} onClick={()=>setFilterStatus("all")}>Всі ({history.length})</button>
            <button className={`filter-btn filter-onTime ${filterStatus==="onTime"?"active":""}`} onClick={()=>setFilterStatus("onTime")}>Вчасно</button>
            <button className={`filter-btn filter-late ${filterStatus==="late"?"active":""}`} onClick={()=>setFilterStatus("late")}>Прострочені</button>
          </div>
        </div>

        {filteredHistory.length===0 ? (
          <div className="history-empty">
            <p style={{fontSize:48, marginBottom:20}}>📚</p>
            <h3>Історія порожня</h3>
            <p>{searchTerm?"Немає результатів за вашим пошуком":"Ви ще не повернули жодної книги"}</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map(item=>{
              const wasLate = isLateReturn(item.dueDate,item.returnedAt);
              const daysLate = calculateDaysLate(item.dueDate,item.returnedAt);
              return (
                <div key={item.id} className="history-item">
                  <div className="history-item-top">
                    <div className="book-info">
                      <h3>📖 {item.bookTitle}</h3>
                      <div className="book-dates">
                        <div>
                          <p>📅 Взято</p>
                          <p>{formatDate(item.borrowedAt)}</p>
                        </div>
                        <div>
                          <p>⏰ Термін</p>
                          <p>{formatDate(item.dueDate)}</p>
                        </div>
                        <div>
                          <p>{wasLate?"❌":"✅"} Повернуто</p>
                          <p>{formatDate(item.returnedAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`status-badge ${wasLate?"status-late":"status-onTime"}`}>
                      {wasLate ? (
                        <>
                          <p>Прострочено</p>
                          <p className="days-late">{daysLate} дн.</p>
                        </>
                      ) : <p>✓ Вчасно</p>}
                    </div>
                  </div>
                  <div className={`bottom-border ${wasLate?"late":"onTime"}`}></div>
                </div>
              );
            })}
          </div>
        )}

        {history.length>0 && (
          <div className="stats-grid">
            <div className="stats-card">
              <p>📚</p>
              <p className="count total">{history.length}</p>
              <p className="label">Всього повернуто</p>
            </div>
            <div className="stats-card">
              <p>✅</p>
              <p className="count onTime">{history.filter(h=>!isLateReturn(h.dueDate,h.returnedAt)).length}</p>
              <p className="label">Повернуто вчасно</p>
            </div>
            <div className="stats-card">
              <p>⏰</p>
              <p className="count late">{history.filter(h=>isLateReturn(h.dueDate,h.returnedAt)).length}</p>
              <p className="label">Прострочено</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RentalHistoryPage;

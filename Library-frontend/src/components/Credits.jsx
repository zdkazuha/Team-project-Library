import { Card, Col, Row } from 'antd';
import { useState } from 'react';
import '../css/Credits.css';

function Credits() {
    const [flag, setFlag] = useState(true);

    function toggleFlag() {
        setFlag(!flag);
    }

    return (
    <div className="credits-container baground">
        <div>

            <h1 className="welcome" style={{paddingTop: '200px'}} onClick={toggleFlag}>{flag === true ? 'Frontend -->' : '<-- Backend'}</h1>
            <hr/>

            <div className={flag === true ? "credits-content" : "credits-content display-none"}>
                <Row gutter={16}>
                    <Col span={8}>
                    <Card title="Artem" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Створив сторінки, дизайн та логіку для сторінок<br/> (MyWishlist, MyBooks, BookPage, Credits, Home, Register, Logout, Login)</li>
                            <li>Реалізація адаптивного вигляду для ноутбука</li>
                            <li>Налаштував вигляд та логіку Layout</li>
                            <li>Ініціалізував Frontend</li>
                        </ul>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card title="Ilya" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Створив логіку та вигляд пошуку для сторінки <br/> (Home)</li>
                            <li>Налаштував захищені маршрути (Private Route)</li>
                            <li>Провів фінальне тестуваня Frontendy</li>
                        </ul>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card title="Yaroslav" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Створив сторінки, дизайн та логіку для сторінок<br/> (RentalHistory, AdminPanel)</li>
                            <li>Створив форму для додавання відгуків на сторінці<br/> (BookPage)</li>
                            <li>Створив та налаштував сповіщення на сайті (Toast)</li>
                        </ul>
                    </Card>
                    </Col>
                </Row>
            </div>

            <div className={flag === false ? "credits-content" : "credits-content display-none"}>
                <Row gutter={16}>
                    <Col span={8}>
                    <Card title="Artem" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Реалізував ендпоінти<br/>(Для: отримування користувача за його почтою, отримування бажаних та орендованих книг користувача за його Id)</li>
                            <li>Створив (Interface, Service, Controller)<br/>(Author, Review, Genre)</li>
                            <li>Створив та налаштував базу даних</li>
                            <li>Додав репозиторій</li>
                            <li>Додав пагінацію</li>
                            <li>Ініціалузав Backend</li>
                        </ul>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card title="Ilya" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Реалізував ендпоінти<br/>(Для: видачі та повернення киниги, отримання орендованих книг, перевірки статусу книги, пошуку книг)</li>
                            <li>Створив (Interface, Service, Controller)<br/>(Borrow, User)</li>
                            <li>Реалізував логіку реестрації та логіну для користувача</li>
                            <li>Створив мапери для всіх DTOs</li>
                            <li>Провів фінальне тестуваня Backendy</li>
                        </ul>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card title="Yaroslav" style={{color: 'white'}} variant="borderless">
                        <ul>
                            <li>Реалізував ендпоінти<br/>(Для: отримання історії оренд користувача)</li>
                            <li>Створив (Interface, Service, Controller)<br/>(History, Wishlist, Book)</li>
                        </ul>
                    </Card>
                    </Col>
                </Row>
            </div>

        </div>
    </div>
  );
}

export default Credits;
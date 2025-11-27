import React, { useContext } from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
    HomeFilled,
    AlignLeftOutlined,
    BookOutlined,
    UserAddOutlined,
    UserOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { UserContext } from '../contexts/User.context';
import '../css/Layout.css';

const { Header, Content, Footer } = Layout;

const items = [
    { key: '/', label: <Link to="/">Home</Link>, icon: <HomeFilled /> },
    { key: 'rental_history', label: <Link to='rental_history'>Rental History</Link>, icon: <AlignLeftOutlined /> },
    { key: 'my_wishlist', label: <Link to='my_wishlist'>My Wishlist</Link>, icon: <BookOutlined /> },
    { key: 'my_books', label: <Link to='my_books'>My Books</Link>, icon: <BookOutlined /> },
    // ...(isAdmin ? [{
    //     key: 'add_book',
    //     label: <Link to='add_book'>Add Book</Link>,
    //     icon: <PlusOutlined />
    // }] : [])
];

const itemsLR = [
  { key: 'register', label: <Link to='register'>Register</Link>, icon: <UserAddOutlined /> },
  { key: 'login', label: <Link to='login'>Login</Link>, icon: <UserOutlined /> }
];

const itemsL = [
  { key: 'logout', label: <Link to='logout'>Logout</Link>, icon: <UserAddOutlined /> }
];

const AppLayout = () => {
  const { email } = useContext(UserContext);

  return (
    <Layout className="layout">
      <Header className="header">
        <h2>Library Books</h2>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          className="menu-main"
        />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={email != null ? itemsL : itemsLR}
          className="menu-auth"
        />
      </Header>

      <Content>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>

      <Footer className="footer">
        Library ©{new Date().getFullYear()} Created Team №4
      </Footer>
    </Layout>
  );
};

export default AppLayout;

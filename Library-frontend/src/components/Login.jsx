import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import image from '../img/Login.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User.context.jsx';
import { toast } from './ToastContainer';
import '../css/Login.css';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setEmail, getIdByEmail } = useContext(UserContext);
  const API = import.meta.env.VITE_API;
  const onFinish = async (values) => {
    try {
      const response = await fetch(API + 'User/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.username,
          password: values.password
        })
      });

      if (!response.ok) {
        toast.error('Login failed.');
        return;
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);

      setEmail(values.username);
      getIdByEmail(values.username);

      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container baground" style={{ backgroundImage: `url(${image})` }}>
      <div className="login-form-container">
        <h1 className="welcome-text">Welcome to the Library<br />System</h1>
        <Form
          className="form-antd"
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Enter your Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input className="form-input" />
          </Form.Item>

          <Form.Item
            label="Enter your Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password className="form-input" />
          </Form.Item>

          <Form.Item>
            <Link to="/register">
              <Button type="primary">Register</Button>
            </Link>

            <Button type="primary" htmlType="submit" className="login-submit-btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;

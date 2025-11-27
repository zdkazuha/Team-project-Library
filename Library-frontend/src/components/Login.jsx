import React, { useContext, useState } from 'react';
import { Button, Form, Input } from 'antd';
import image from '../img/Login.jpg';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User.context.jsx';
import '../css/Login.css';
import { toast } from './ToastContainer';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { setEmail, getIdByEmail } = useContext(UserContext);

  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      const response = await fetch('https://localhost:7167/api/User/login', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({
              email: values.username,
              password: values.password
          })
      });

    if(!response.ok) {
      if (response.ok) {
        toast.success('✅ Registration successful!');
      } else {
        toast.error('❌ Registration failed.');
  }
    }

    const data = await response.json();
    localStorage.setItem('token', data);

    setEmail(values.username);

      const data = await response.json();
      localStorage.setItem('token', data.token);

      setEmail(values.username);
      getIdByEmail(values.username);
  } catch (error) {
    console.error('Error:', error);
    toast.error('❌ Login failed.');
  }

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed');
    }
  };

  const onFinishFailed = errorInfo => {
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
            <Input className="form-input"/>
          </Form.Item>

          <Form.Item
            label="Enter your Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password className="form-input"/>
          </Form.Item>

          <Form.Item>
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

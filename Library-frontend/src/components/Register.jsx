import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import image from '../img/Login.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User.context.jsx';
import { toast } from './ToastContainer';
import '../css/Register.css';

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { setEmail, getIdByEmail } = useContext(UserContext);

  const onFinish = async (values) => {
    if (values.password_One !== values.password_Two) {
      toast.error('Passwords are not the same');
      return;
    }

    try {
      const response = await fetch('https://localhost:7167/api/User/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.username,
          password: values.password_One
        })
      });

      if (!response.ok) {
        toast.error('Register failed.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      setEmail(values.username);
      getIdByEmail(values.username);

      toast.success('Register successful!');
      navigate('/');
    } catch (error) {
      toast.error('Register failed.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      className="container baground"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="form-container">

        <h1 className="welcome">Please register</h1>

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
            <Input />
          </Form.Item>

          <Form.Item
            label="Enter your Password"
            name="password_One"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Repeat your Password"
            name="password_Two"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to="/login">
              <Button type="primary">Login</Button>
            </Link>

          </Form.Item>
        </Form>

      </div>
    </div>
  );
}

export default Register;

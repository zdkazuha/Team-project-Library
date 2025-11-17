import React, { useContext, useState } from 'react';
import { Button, Form, Input } from 'antd';
import image from '../img/Login.jpg';
import Password from 'antd/es/input/Password';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User.context.jsx';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const { setEmail } = useContext(UserContext);

const onFinish = async (values) => {
  console.log('Success:', values);

  try {
    const response = await fetch('http://localhost:5162/api/User/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            email: values.username,
            password: values.password
        })
    })

    if(!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data);

    setEmail(values.username);

    navigate('/')

  } catch (error) {
    console.error('Error:', error);
    alert('Login failed');
  }

};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

  return (
    <div className="container baground" style={{ backgroundImage: `url(${image})` }}>

      <div className="form-container" style={{height: 450}}>
      <h1 className="welcome" style={{marginTop: -100, paddingBottom: 50}}>Welcome to the Library<br />System</h1>
        <Form
        className='form-antd'
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
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{width: 150}}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;

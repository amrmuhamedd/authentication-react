import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { Typography } from "antd";

import { registerUser } from "../../store/auth/authSlice";
import { AppDispatch, RootState } from "../../store/store";

import {
  AuthFormContainer,
  AuthWrapper,
  BottomText,
  ErrorMessage,
  StyledAuthLink,
} from "./shared/auth-styles";

const { Title, Text } = Typography;

export const SignupForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [formErrors, setFormErrors] = useState<any[]>([]);

  const isFormValid = () => {
    const values = form.getFieldsValue();
    return (
      values.email && values.password && values.name && formErrors.length === 0
    );
  };

  const handleSignup = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    const resultAction = await dispatch(registerUser(values));

   console.log(resultAction);
    
    if (registerUser.fulfilled.match(resultAction)) {
      notification.success({
        message: "Registration Successful",
        description: "Your account has been created successfully.",
        duration: 3,
        placement: "bottomRight",
      });
      navigate("/");
    } else {
      notification.error({
        message: "Registration Failed",
        description: resultAction.payload as string,
        duration: 3,
        placement: "bottomRight",
      });
    }
  };

  return (
    <AuthWrapper>
      <AuthFormContainer>
        <Title
          level={2}
          style={{ textAlign: "center", fontWeight: "bold", marginBottom: 8 }}
        >
          Create Account
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 32,
            color: "#6B7280",
          }}
        >
          Sign up to get started
        </Text>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          name="signup"
          onFinish={handleSignup}
          layout="vertical"
          size="large"
          form={form}
          onValuesChange={() => {
            form
              .validateFields()
              .then(() => setFormErrors([]))
              .catch(({ errorFields }) => setFormErrors(errorFields));
          }}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 3, message: "name should be more than 3 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Full name"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Email address"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]+$/,
                message:
                  "Password must contain at least one letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Password"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isFormValid()}
              block
              style={{
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 500,
                background: !isFormValid() ? "#d9d9d9" : "#1890ff",
                color: "white",
              }}
            >
              Create Account
            </Button>
          </Form.Item>

          <BottomText>
            Already have an account?{" "}
            <StyledAuthLink to="/login">Sign in</StyledAuthLink>
          </BottomText>
        </Form>
      </AuthFormContainer>
    </AuthWrapper>
  );
};

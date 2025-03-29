import { Layout, Button, Typography } from "antd";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/auth/authSlice";

const { Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout =async () => {
  await dispatch(logoutUser()).unwrap()
  };

  return (
    <StyledLayout>
      <Layout>
        <StyledContent>
          <Title level={4}>Welcome to the application</Title>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
}

export default Dashboard;

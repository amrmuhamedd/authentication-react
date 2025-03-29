import { QuestionCircleOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const TABLET = '1024px';

const ResponsiveFlex = styled(Flex)`
  height: 100%;
  background-color: #0D92F4;
  color: white;

  @media (max-width: ${TABLET}) {
    padding: 24px;
  }
`;

const ResponsiveTitle = styled(Title)`
  &.ant-typography {
    color: white;
    margin-top: 24px;
    text-align: center;

    @media (max-width: ${TABLET}) {
      margin-top: 16px;
      font-size: 24px !important;
    }
  }
`;

const ResponsiveText = styled(Text)`
  &.ant-typography {
    color: white;
    text-align: center;
    font-size: 16px;
    max-width: 400px;

    @media (max-width: ${TABLET}) {
      font-size: 14px;
      max-width: 300px;
    }
  }
`;

const IconContainer = styled.div`
  font-size: 48px;
  color: white;
  border: 2px dashed white;
  border-radius: 50%;
  padding: 16px;

  @media (max-width: ${TABLET}) {
    font-size: 32px;
    padding: 12px;
  }
`;

const IconGroup = styled(Flex)`
  margin-top: 32px;

  @media (max-width: ${TABLET}) {
    margin-top: 24px;

    .anticon {
      font-size: 20px !important;
    }
  }
`;

export default function AuthSide() {
  return (
    <ResponsiveFlex vertical justify="center" align="center">
      <IconContainer>
        <QuestionCircleOutlined />
      </IconContainer>

      <ResponsiveTitle level={2}> Authenticate </ResponsiveTitle>

      <ResponsiveText>
        authenticate to access your account 
      </ResponsiveText>

      <IconGroup gap="middle">
        <QuestionCircleOutlined style={{ fontSize: '24px' }} />
        <TeamOutlined style={{ fontSize: '24px' }} />
        <StarOutlined style={{ fontSize: '24px' }} />
      </IconGroup>
    </ResponsiveFlex>
  );
}

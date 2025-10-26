import { FC } from 'react';
import {
  Form,
  DatePicker,
  Button,
  Space,
  Flex,
  FormProps,
  Card,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs'
const { RangePicker } = DatePicker;

interface FormValues {
  dateRange: [Dayjs, Dayjs];
}


interface QueryFormProps {
  onSearch: (values: FormValues) => void;
}

const QueryForm: FC<QueryFormProps> = ({ onSearch }) => {
  const [form] = Form.useForm<FormValues>();

  const handleFinish: FormProps<FormValues>['onFinish'] = (values) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
  };


  return (
    <Card>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          dateRange: [],
        }}
      >
        <Flex gap="large" wrap="wrap">
          <Form.Item name="dateRange" noStyle>
            <RangePicker style={{ flexGrow: 1, minWidth: 220 }} />
          </Form.Item>

          <Flex gap="middle" wrap="wrap" align="center" style={{ width: '100%' }}>
            <Form.Item noStyle>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleReset} htmlType='submit' icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Card>

  );
};

export default QueryForm;
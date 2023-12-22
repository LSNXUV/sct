'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import Student from '@/lib/api/student/student'
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, InputRef, Popconfirm, Popover, Space, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import type { StudentType } from '@/lib/api/student/student'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { useAuth } from '@/context/Auth/Auth';

/**
 * type StudentType = {
    id:string,
    major:string,
    name:string,
    age:number,
    gender:string,
    phone:string,
    email:string
}
 */

type DataIndex = keyof StudentType;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: StudentType;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function Students() {
    const { message } = App.useApp()
    const [Students, setStudents] = useState<StudentType[]>([])
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const Auth = useAuth()
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: StudentType) => record.id === editingKey;
    const edit = (record: Partial<StudentType>) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.id ?? '');
    };
    const cancel = () => {
        setEditingKey('');
    };

    const saveStudents = async (key: React.Key) => {
        const row = (await form.validateFields()) as StudentType;
        const newData = [...Students];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Student.save({ ...row, id: key as string })
        Auth.resCall(res)
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
            setStudents(newData);
            setEditingKey('');
        } else {
            newData.push(row);
            setStudents(newData);
            setEditingKey('');
        }
    };

    const deleteStudents = async (key: React.Key) => {
        const newData = [...Students];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Student.deleteById(key as string)
        Auth.resCall(res)
        if (index > -1) {
            newData.splice(index, 1);
            setStudents(newData);
            setEditingKey('');
        } else {
            message.error('删除失败')
        }
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<StudentType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    autoComplete='off'
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(clearFilters)
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        清空
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        关闭
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? text : (
                text
            ),
    });

    const columns = [
        {
            title: '学号',
            dataIndex: 'id',
            editable: false,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            editable: true,
            ...getColumnSearchProps('name'),
            sorter: (a: StudentType, b: StudentType) => a.name.localeCompare(b.name),
        },
        {
            title: '年龄',
            dataIndex: 'age',
            editable: true,
            sorter: (a: StudentType, b: StudentType) => a.age - b.age,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            editable: true,
            filters: [
                { text: '男', value: '男' },
                { text: '女', value: '女' },
            ],
            onFilter: (value: boolean | React.Key, record: StudentType) => record.gender === value,
        },
        {
            title: '专业',
            dataIndex: 'major',
            editable: true,
            filters: [
                { text: '计算机科学与技术', value: '计算机科学与技术' },
                { text: '金融科技', value: '金融科技' },
                { text: '自动化', value: '自动化' },
                { text: '工商管理', value: '工商管理' },
                { text: '国际旅游', value: '国际旅游' },
                { text: '人工智能', value: '人工智能' },
                { text: '生物工程', value: '生物工程' },
                { text: '机械工程', value: '机械工程' },
                { text: '心理学', value: '心理学' },
                { text: '法律学', value: '法律学' },
                { text: '市场营销', value: '市场营销' },
                { text: '环境科学', value: '环境科学' },
                { text: '历史学', value: '历史学' },
                { text: '天文学', value: '天文学' },
                { text: '国际贸易', value: '国际贸易' },
                { text: '音乐学', value: '音乐学' },
                { text: '教育学', value: '教育学' },
                { text: '物理学', value: '物理学' },
                { text: '社会学', value: '社会学' },
                { text: '软件工程', value: '软件工程' },
                { text: '天文学', value: '天文学' },
                { text: '天文学', value: '天文学' },
                { text: '软件工程', value: '软件工程' },
                { text: '网络工程', value: '网络工程' },
                { text: '信息安全', value: '信息安全' },
                { text: '物联网工程', value: '物联网工程' },
                { text: '电子信息工程', value: '电子信息工程' },
                { text: '通信工程', value: '通信工程' },
                { text: '电子科学与技术', value: '电子科学与技术' },
                { text: '集成电路设计与集成系统', value: '集成电路设计与集成系统' },
                { text: '电磁场与无线技术', value: '电磁场与无线技术' },
                { text: '测控技术与仪器', value: '测控技术与仪器' },
                { text: '机械设计制造及其自动化', value: '机械设计制造及其自动化' },
                { text: '工业设计', value: '工业设计' },
                { text: '过程装备与控制工程', value: '过程装备与控制工程' },
                { text: '车辆工程', value: '车辆工程' },
                { text: '工业工程', value: '工业工程' },
                { text: '材料成型及控制工程', value: '材料成型及控制工程' },
                { text: '材料科学与工程', value: '材料科学与工程' },
                { text: '高分子材料与工程', value: '高分子材料与工程' },
            ],
            filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value: boolean | React.Key, record: StudentType) => record.major.includes(value as string) ,
            sorter: (a: StudentType, b: StudentType) => a.major.localeCompare(b.major),
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            editable: true,
            ...getColumnSearchProps('phone'),
            sorter: (a: StudentType, b: StudentType) => a.phone.localeCompare(b.phone),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            editable: true,
            ...getColumnSearchProps('email'),
            sorter: (a: StudentType, b: StudentType) => a.email.localeCompare(b.email),
        }, {
            title: 'action',
            dataIndex: 'action',
            render: (_: any, record: StudentType) => {
                const editable = isEditing(record);
                return (
                    <>
                        <Space>
                            {
                                editable ? (
                                    <Space>
                                        <Button type='primary' onClick={() => saveStudents(record.id)}>保存</Button>
                                        <Button type='default' onClick={cancel}>取消</Button>
                                    </Space>
                                ) : (
                                    <Button type='primary' disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Button>
                                )
                            }
                            <Popconfirm
                                title="确定删除?"
                                onConfirm={async () => {
                                    await deleteStudents(record.id)
                                }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type='default' danger>删除</Button>
                            </Popconfirm>
                        </Space>
                    </>
                )
            }

        }
    ]

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: StudentType) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const { data: _, loading: loadingStudents, run: getStudents } = useRequest(
        () => Student.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                Auth.resCall(res,() => {
                    setStudents(res.data.content)
                })
            },
            onError: (error) => {
                message.error('获取失败')
                console.error(error)
            }
        }
    )

    useEffect(() => {
        getStudents()

    }, [getStudents])


    return (
        <Content style={{
            padding: '50px 24px',
        }}>
            <Popover content={'点击刷新'} placement='right'>
                <Title level={1}
                    style={{
                        width: '10rem',
                        marginBottom: '2%',
                        cursor: 'pointer'

                    }}
                    onClick={() => {
                        getStudents()
                    }}
                >
                    学生概况
                </Title>
            </Popover>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                        selections: [
                            Table.SELECTION_ALL,
                            Table.SELECTION_INVERT,
                            Table.SELECTION_NONE,
                            {
                                key: 'odd',
                                text: '偶数行',
                                onSelect: (changeableRowKeys) => {
                                    let newSelectedRowKeys = [];
                                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                                        if (index % 2 !== 0) {
                                            return false;
                                        }
                                        return true;
                                    });
                                    setSelectedRowKeys(newSelectedRowKeys);
                                },
                            },
                            {
                                key: 'even',
                                text: '奇数行',
                                onSelect: (changeableRowKeys) => {
                                    let newSelectedRowKeys = [];
                                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                                        if (index % 2 !== 0) {
                                            return true;
                                        }
                                        return false;
                                    });
                                    setSelectedRowKeys(newSelectedRowKeys);
                                },
                            },
                        ],
                    }}
                    loading={loadingStudents}
                    dataSource={Students.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })}
                    columns={mergedColumns as ColumnsType<StudentType>}
                    pagination={{
                        onChange: cancel,
                        pageSize: 8,
                        position: ['bottomCenter']
                    }}
                />
            </Form>
        </Content>
    )
}

function StudentPage() {
    return (
        <FLayout>
            <CusMenu OpenSubKey={['2']} SelectKey='21' />
            <Students />
        </FLayout>
    )
}

export default StudentPage
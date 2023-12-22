'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import Teacher from '@/lib/api/teacher/teacher'

import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, InputRef, Popconfirm, Popover, Space, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import type { TeacherType } from '@/lib/api/teacher/teacher'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { useAuth } from '@/context/Auth/Auth';

/**
 * type TeacherType ={
    id:number;
    department:string;
    name:string;
    age:number;
    gender:string;
    phone:string;
    email:string;
}
 */

type DataIndex = keyof TeacherType;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: TeacherType;
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

function Teachers() {
    const { message } = App.useApp()
    const [Teachers, setStudents] = useState<TeacherType[]>([])
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const Auth = useAuth()
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: TeacherType) => record.id === editingKey;
    const edit = (record: Partial<TeacherType>) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.id ?? '');
    };
    const cancel = () => {
        setEditingKey('');
    };

    const saveStudents = async (key: React.Key) => {
        const row = (await form.validateFields()) as TeacherType;
        const newData = [...Teachers];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Teacher.save({ ...row, id: key as string })
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
        const newData = [...Teachers];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Teacher.deleteById(key as string)
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<TeacherType> => ({
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
            title: '教师号',
            dataIndex: 'id',
            editable: false,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            editable: true,
            ...getColumnSearchProps('name'),
            sorter: (a: TeacherType, b: TeacherType) => a.name.localeCompare(b.name),
        },
        {
            title: '年龄',
            dataIndex: 'age',
            editable: true,
            sorter: (a: TeacherType, b: TeacherType) => a.age - b.age,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            editable: true,
            filters: [
                { text: '男', value: '男' },
                { text: '女', value: '女' },
            ],
            onFilter: (value: boolean | React.Key, record: TeacherType) => record.gender === value,
        },
        {
            title: '部门',
            dataIndex: 'department',
            editable: true,
            filters: [
                { text: '计算机科学与信息工程', value: '计算机科学与信息工程' },
                { text: '人工智能', value: '人工智能' },
                { text: '软件工程', value: '软件工程' },
                { text: '网络工程', value: '网络工程' },
                { text: '信息安全', value: '信息安全' },
                { text: '物联网工程', value: '物联网工程' },
                { text: '数字媒体技术', value: '数字媒体技术' },
                { text: '电子信息工程', value: '电子信息工程' },
                { text: '通信工程', value: '通信工程' },
                { text: '金融工程', value: '金融工程' },
                { text: '工商管理', value: '工商管理' },
                { text: '市场营销', value: '市场营销' },
                { text: '会计学', value: '会计学' },
                { text: '财务管理', value: '财务管理' },
                { text: '国际经济与贸易', value: '国际经济与贸易' },
                { text: '电子商务', value: '电子商务' },
                { text: '经济学', value: '经济学' },
                { text: '金融学', value: '金融学' },
                { text: '法学', value: '法学' },
                { text: '行政管理', value: '行政管理' },
                { text: '公共事业管理', value: '公共事业管理' },
                { text: '社会工作', value: '社会工作' }
            ],
            filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value: boolean | React.Key, record: TeacherType) => record.department.includes(value as string) ,
            sorter: (a: TeacherType, b: TeacherType) => a.department.localeCompare(b.department),
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            editable: true,
            ...getColumnSearchProps('phone'),
            sorter: (a: TeacherType, b: TeacherType) => a.phone.localeCompare(b.phone),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            editable: true,
            ...getColumnSearchProps('email'),
            sorter: (a: TeacherType, b: TeacherType) => a.email.localeCompare(b.email),
        }, {
            title: 'action',
            dataIndex: 'action',
            render: (_: any, record: TeacherType) => {
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
            onCell: (record: TeacherType) => ({
                record,
                inputType: col.dataIndex === 'age' || col.dataIndex === 'phone' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const { data: _, loading: loadingStudents, run: getStudents } = useRequest(
        () => Teacher.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                Auth.resCall(res,() => {
                    setStudents(res.data)
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
                    教师概况
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
                    dataSource={Teachers.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })}
                    columns={mergedColumns as ColumnsType<TeacherType>}
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
            <CusMenu OpenSubKey={['5']} SelectKey='51' />
            <Teachers />
        </FLayout>
    )
}

export default StudentPage
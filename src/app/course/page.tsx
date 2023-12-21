'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import Course, { CourseType } from '@/lib/api/course/course'
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, InputRef, Popconfirm, Popover, Space, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';

/**
 * type CourseType = {
    id: string;
    name: string;
    credit: number;
    hours: number;
}
 */

type DataIndex = keyof CourseType;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: CourseType;
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

function Courses() {
    const { message } = App.useApp()
    const [Courses, setCourses] = useState<CourseType[]>([])
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: CourseType) => record.id === editingKey;
    const edit = (record: Partial<CourseType>) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.id ?? '');
    };
    const cancel = () => {
        setEditingKey('');
    };

    const saveCourses = async (key: React.Key) => {
        const row = (await form.validateFields()) as CourseType;
        const newData = [...Courses];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Course.save({ ...row, id: key as string })
        if (res.code !== 0) {
            message.error(res.msg)
            return
        }
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
            setCourses(newData);
            setEditingKey('');
            message.success('保存成功')
        } else {
            newData.push(row);
            setCourses(newData);
            setEditingKey('');
        }
    };

    const deleteCourses = async (key: React.Key) => {
        const newData = [...Courses];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Course.deleteById(key as string)
        if (res.code !== 0) {
            message.error(res.msg)
            return
        }
        if (index > -1) {
            newData.splice(index, 1);
            setCourses(newData);
            setEditingKey('');
            message.success('删除成功')
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<CourseType> => ({
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
            title: '课号',
            dataIndex: 'id',
            editable: false,
        },
        {
            title: '课程名',
            dataIndex: 'name',
            editable: true,
            ...getColumnSearchProps('name'),
            sorter: (a: CourseType, b: CourseType) => a.name.localeCompare(b.name),
        },
        {
            title: '学分',
            dataIndex: 'credit',
            editable: true,
            sorter: (a: CourseType, b: CourseType) => a.credit - b.credit,
        },
        {
            title: '学时',
            dataIndex: 'hours',
            editable: true,
            sorter: (a: CourseType, b: CourseType) => a.hours - b.hours,
        }, {
            title: 'action',
            dataIndex: 'action',
            render: (_: any, record: CourseType) => {
                const editable = isEditing(record);
                return (
                    <>
                        <Space>
                            {
                                editable ? (
                                    <Space>
                                        <Button type='primary' onClick={() => saveCourses(record.id)}>保存</Button>
                                        <Button type='default' onClick={cancel}>取消</Button>
                                    </Space>
                                ) : (
                                    <Button type='primary' disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Button>
                                )
                            }
                            <Popconfirm
                                title="确定删除?"
                                onConfirm={async() => {
                                    await deleteCourses(record.id)
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
            onCell: (record: CourseType) => ({
                record,
                inputType: col.dataIndex === 'credit' || col.dataIndex === 'hours' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const { data: _, loading: loadingStudents, run: getCourses } = useRequest(
        () => Course.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                if (res.code === 0) {
                    message.success('获取成功')
                    setCourses(res.data)
                }
            },
            onError: (error) => {
                message.error('获取失败')
                console.error(error)
            }
        }
    )

    useEffect(() => {
        getCourses()

    }, [getCourses])


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
                        getCourses()
                    }}
                >
                    课程概况
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
                    dataSource={Courses.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })}
                    columns={mergedColumns as ColumnsType<CourseType>}
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
            <CusMenu OpenSubKey={['3']} SelectKey='31' />
            <Courses />
        </FLayout>
    )
}

export default StudentPage
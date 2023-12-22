'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import SC, { SCType } from '@/lib/api/sc/sc'
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, InputRef, Popconfirm, Popover, Space, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { CourseType } from '@/lib/api/course/course';
import { StudentType } from '@/lib/api/student/student';
import { useAuth } from '@/context/Auth/Auth';

/*
type StudentType = {
    id:string,
    major:string,
	name:string,
	age:number,
	gender:string,
	phone:string,
	email:string
} 
type SCType = {
    id: string;
    name: string;
    credit: number;
    hours: number;
}
type SCType = {
    id: number;
    course:SCType,
    student:StudentType,
    score:number | null;
}
 */

type DataIndex = keyof SCType;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: SCType;
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

function SCs() {
    const { message } = App.useApp()
    const [SCs, setCourses] = useState<SCType[]>([])
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const Auth = useAuth()
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: SCType) => record.id === editingKey;
    const edit = (record: Partial<SCType>) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.id ?? '');
    };
    const cancel = () => {
        setEditingKey('');
    };

    const saveScore = async (key: string) => {
        const row = (await form.validateFields()) as SCType;
        const newData = [...SCs];
        const index = newData.findIndex((item) => key === item.id);
        const res = await SC.score(key,row.score)
        Auth.resCall(res)
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
            setCourses(newData);
            setEditingKey('');
        } else {
            newData.push(row);
            setCourses(newData);
            setEditingKey('');
        }
    };

    const deleteSC = async (key: React.Key) => {
        const newData = [...SCs];
        const index = newData.findIndex((item) => key === item.id);
        const res = await SC.deleteById(key as string)
        Auth.resCall(res)
        if (index > -1) {
            newData.splice(index, 1);
            setCourses(newData);
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<SCType> => ({
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
        onFilter: (value, record:SCType) =>{
            if(dataIndex === 'course' || dataIndex === 'student')
                return record[dataIndex].name
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
            return record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => {
            return text.name ?? text
        }
                //如果text是对象，那么就是course或者student，需要取name
                
    });

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            editable: false,
        },
        {
            title: '课程名',
            dataIndex: 'course',
            editable: false,
            
            filters: [
                { text: '计算机体系结构',value: '计算机体系结构'},
                { text: '软件工程',value: '软件工程'},
                { text: '形势与政策',value: '形势与政策'},
                { text: '计算机网络',value: '计算机网络'},
                { text: '操作系统',value: '操作系统'},
                { text: '生态文明',value: '生态文明'}
            ],
            render: (text:CourseType) => {
                return text.name ?? text
            },
            onFilter: (value:boolean | React.Key, record:SCType) => record.course.name.includes(value as string),
            // ...getColumnSearchProps('course'),
            sorter: (a: SCType, b: SCType) => a.course.name.localeCompare(b.course.name),
           
        },
        {
            title: '学生名',
            dataIndex: 'student',
            editable: false,
            ...getColumnSearchProps('student'),
            sorter: (a: SCType, b: SCType) => a.student.name.localeCompare(b.student.name),
            
        },
        {
            title: '分数',
            dataIndex: 'score',
            editable: true,
            sorter: (a: SCType, b: SCType) => a.score - b.score,
        }
        ,{
            title: 'action',
            dataIndex: 'action',
            editable: false,
            render: (_: any, record: SCType) => {
                const editable = isEditing(record);
                return (
                    <>
                        <Space>
                            {
                                editable ? (
                                    <Space>
                                        <Button type='primary' onClick={() => saveScore(record.id)}>保存</Button>
                                        <Button type='default' onClick={cancel}>取消</Button>
                                    </Space>
                                ) : (
                                    <Button type='primary' disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Button>
                                )
                            }
                            <Popconfirm
                                title="确定删除?"
                                onConfirm={async() => {
                                    await deleteSC(record.id)
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
            onCell: (record: SCType) => ({
                record,
                inputType: col.dataIndex === 'score' || col.dataIndex === 'hours' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const { data: _, loading: loadingStudents, run: getCourses } = useRequest(
        () => SC.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                Auth.resCall(res,() => {
                    setCourses(res.data)
                })
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
                    成绩概况
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
                    dataSource={SCs.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })}
                    columns={mergedColumns as ColumnsType<SCType>}
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
            <CusMenu OpenSubKey={['']} SelectKey='6' />
            <SCs />
        </FLayout>
    )
}

export default StudentPage
'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'

import Course, { CourseType } from '@/lib/api/course/course'
import SC, { SCType } from '@/lib/api/sc/sc';
import { StudentType } from '@/lib/api/student/student';

import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Carousel, ConfigProvider, Form, Input, InputNumber, InputRef, Modal, Popconfirm, Popover, Space, Table,theme } from 'antd'
const { useToken } = theme;
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { useAuth } from '@/context/Auth/Auth';
import TC, { TCType } from '@/lib/api/tc/tc';
import { TeacherType } from '@/lib/api/teacher/teacher';


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
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const Auth = useAuth()
    const [editingKey, setEditingKey] = useState('');

    const [SCs, setSCs] = useState<SCType[]>([])
    const [TCs, setTCs] = useState<TCType[]>([])
    const [detailOpen, setdetailOpen] = useState(false)
    const [detailCourseId, setdetailCourseId] = useState('')
    const [detailCourseStudents, setdetailCourseStudents] = useState<SCType[]>([])
    const [detailCourseTeachers, setdetailCourseTeachers] = useState<TCType[]>([])
    const {token:themeToken} = useToken()
    const { loading: loadingSCs, run: getAllSCs } = useRequest(
        () => SC.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                Auth.resCall(res, () => {
                    setSCs(res.data)
                })
            },
            onError: (error) => {
                message.error('获取失败')
                console.error(error)
            }
        }
    )
    const { loading: loadingTCs, run: getAllTCs } = useRequest(
        () => TC.getAll(),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                Auth.resCall(res, () => {
                    setTCs(res.data)
                })
            },
            onError: (error) => {
                message.error('获取失败')
                console.error(error)
            }
        }
    )

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
        Auth.resCall(res,() => {
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
        })
        
    };

    const deleteCourses = async (key: React.Key) => {
        const newData = [...Courses];
        const index = newData.findIndex((item) => key === item.id);
        const res = await Course.deleteById(key as string)
        Auth.resCall(res,() => {
            if (index > -1) {
                newData.splice(index, 1);
                setCourses(newData);
                setEditingKey('');
            } else {
                message.error('删除失败')
            }
        })
        
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
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
                                    <>
                                        <Button type='primary' onClick={() => {
                                            setdetailOpen(true)
                                            setdetailCourseId(record.id)
                                            setdetailCourseStudents(SCs.filter((item) => item.course.id === record.id))
                                            setdetailCourseTeachers(TCs.filter((item) => item.course.id === record.id))
                                        }}>详情</Button>
                                        <Button type='default' disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Button>
                                    </>
                                )
                            }
                            <Popconfirm
                                title="确定删除?"
                                onConfirm={async () => {
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
                Auth.resCall(res, () => {
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
        getAllSCs()
        getAllTCs()
    }, [getCourses, getAllSCs, getAllTCs])


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
                        getAllSCs()
                        getAllTCs()
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
            {
                <Modal
                    title={<Title level={3}></Title>} width={1000}
                    open={detailOpen}
                    footer={null}
                    onCancel={() => {
                        setdetailOpen(false)
                    }}
                >
                    <ConfigProvider
                        theme={{
                            components:{
                                Carousel:{
                                    dotActiveWidth: 17,
                                    dotWidth: 17,
                                    dotHeight: 17,
                                    colorBgContainer: themeToken.colorPrimary,
                                }
                            }
                        }}
                    >
                        <Carousel>
                            <>
                                <Title level={4}>选课学生</Title>
                                <Table
                                    dataSource={detailCourseStudents.map((item) => {
                                        return {
                                            ...item.student,
                                            key: item.id
                                        }
                                    })}
                                    columns={[
                                        {
                                            title: '学号',
                                            dataIndex: 'id',
                                        },
                                        {
                                            title: '姓名',
                                            dataIndex: 'name',
                                            sorter: (a: StudentType, b: StudentType) => a.name.localeCompare(b.name),
                                        },
                                        {
                                            title: '年龄',
                                            dataIndex: 'age',
                                            sorter: (a: StudentType, b: StudentType) => a.age - b.age,
                                        },
                                        {
                                            title: '性别',
                                            dataIndex: 'gender',
                                            filters: [
                                                { text: '男', value: '男' },
                                                { text: '女', value: '女' },
                                            ],
                                            onFilter: (value: boolean | React.Key, record: StudentType) => record.gender === value,
                                        },
                                        {
                                            title: '专业',
                                            dataIndex: 'major',
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
                                            onFilter: (value: boolean | React.Key, record: StudentType) => record.major.includes(value as string),
                                            sorter: (a: StudentType, b: StudentType) => a.major.localeCompare(b.major),
                                        },
                                        {
                                            title: '手机号',
                                            dataIndex: 'phone',
                                            sorter: (a: StudentType, b: StudentType) => a.phone.localeCompare(b.phone),
                                        },
                                        {
                                            title: '邮箱',
                                            dataIndex: 'email',
                                            sorter: (a: StudentType, b: StudentType) => a.email.localeCompare(b.email),
                                        }, {
                                            title: 'action',
                                            dataIndex: 'action',
                                            render: (_: any, record: StudentType & { key: string }) => {
                                                return (
                                                    <>
                                                        <Space>
                                                            <Popconfirm
                                                                title="确定删除?"
                                                                onConfirm={async () => {
                                                                    const res = await SC.deleteById(record.key)
                                                                    Auth.resCall(res, () => {
                                                                        setdetailCourseStudents(detailCourseStudents.filter((item) => item.id !== record.key))
                                                                    })
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

                                    ] as ColumnsType<StudentType>}
                                    pagination={{
                                        onChange: cancel,
                                        pageSize: 4,
                                        position: ['bottomCenter']
                                    }}
                                />
                                <Title level={4}>添加学生:</Title>
                                <Form
                                    style={{ marginTop: '2%' }}
                                    onFinish={async (values) => {
                                        const res = await SC.save(detailCourseId, values.sid)
                                        Auth.resCall(res, () => {
                                            setdetailCourseStudents([...detailCourseStudents, res.data])
                                        })
                                    }}
                                >
                                    <Form.Item
                                        label='学号'
                                        name='sid'
                                        rules={[{ required: true, message: '请输入学号' }]}
                                    >
                                        <InputNumber style={{ width: '15%' }} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>添加</Button>
                                    </Form.Item>
                                </Form>
                            </>
                            <>
                                <Title level={4}>选课教师</Title>
                                <Table
                                    dataSource={detailCourseTeachers.map((item) => {
                                        return {
                                            ...item.teacher,
                                            key: item.id
                                        }
                                    })}
                                    columns={[
                                        {
                                            title: '教师号',
                                            dataIndex: 'id',
                                        },
                                        {
                                            title: '姓名',
                                            dataIndex: 'name',
                                            sorter: (a: TeacherType, b: TeacherType) => a.name.localeCompare(b.name),
                                        },
                                        {
                                            title: '年龄',
                                            dataIndex: 'age',
                                            sorter: (a: TeacherType, b: TeacherType) => a.age - b.age,
                                        },
                                        {
                                            title: '性别',
                                            dataIndex: 'gender',
                                            filters: [
                                                { text: '男', value: '男' },
                                                { text: '女', value: '女' },
                                            ],
                                            onFilter: (value: boolean | React.Key, record: TeacherType) => record.gender === value,
                                        },
                                        {
                                            title: '部门',
                                            dataIndex: 'department',
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
                                            onFilter: (value: boolean | React.Key, record: TeacherType) => record.department.includes(value as string),
                                            sorter: (a: TeacherType, b: TeacherType) => a.department.localeCompare(b.department),
                                        },
                                        {
                                            title: '手机号',
                                            dataIndex: 'phone',
                                            sorter: (a: TeacherType, b: TeacherType) => a.phone.localeCompare(b.phone),
                                        },
                                        {
                                            title: '邮箱',
                                            dataIndex: 'email',
                                            sorter: (a: TeacherType, b: TeacherType) => a.email.localeCompare(b.email),
                                        }, {
                                            title: 'action',
                                            dataIndex: 'action',
                                            render: (_: any, record: TeacherType & { key: string }) => {
                                                return (
                                                    <>
                                                        <Space>
                                                            <Popconfirm
                                                                title="确定删除?"
                                                                onConfirm={async () => {
                                                                    const res = await TC.deleteById(record.key)
                                                                    Auth.resCall(res, () => {
                                                                        setdetailCourseTeachers(detailCourseTeachers.filter((item) => item.id !== record.key))
                                                                    })
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
                                    ] as ColumnsType<TeacherType>}
                                    pagination={{
                                        onChange: cancel,
                                        pageSize: 4,
                                        position: ['bottomCenter']
                                    }}
                                />
                                <Title level={4}>添加教师:</Title>
                                <Form
                                    style={{ marginTop: '2%' }}
                                    onFinish={async (values) => {
                                        const res = await TC.save(detailCourseId, values.tid)
                                        Auth.resCall(res, () => {
                                            setdetailCourseTeachers([...detailCourseTeachers, res.data])
                                        })
                                    }}
                                >
                                    <Form.Item
                                        label='教师号'
                                        name='tid'
                                        rules={[{ required: true, message: '请输入教师号' }]}
                                    >
                                        <InputNumber style={{ width: '15%' }} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>添加</Button>
                                    </Form.Item>
                                </Form>
                            </>
                        </Carousel>
                    </ConfigProvider>
                </Modal>
            }
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
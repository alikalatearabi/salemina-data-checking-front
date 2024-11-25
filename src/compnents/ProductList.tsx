import { useEffect, useState } from "react";
import { DataType, useData } from "../store/dataContext";
import { Button, ConfigProvider, Input, Modal, Table, Tooltip, notification } from "antd";
import { Product, updateProduct } from "../api/product";
import ActionCell from "./ActionCell";


const ProductList = () => {

    const [editingRow, setEditingRow] = useState<string | null>(null)
    const [editedData, setEditedData] = useState<DataType["data"] | undefined>()
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data, fetchData } = useData();

    useEffect(() => {
        setEditedData(data.data)
    }, [data])

    const paginationHandler = (pagination: number) => {
        fetchData({ page: `${pagination}`, limit: '10' })
    }

    const handleEdit = (product: Product) => {
        setEditingRow(product._id);
    };
    const handleCancelEdit = () =>{
        setEditingRow(null);
    }

    const handleSave = async (product: Product) => {
        try {
            await updateProduct(product)
            openNotification('success', 'Update Successful', 'اطلاعات محصول با موفقیت اصلاح شد');
        } catch (error) {
            openNotification('error', 'Update Failed', 'Failed to update the product.');
        }
        setEditingRow(null);
    };

    const handleChangeInput = (recordId: string, key: string, value: string) => {
        const updatedData = editedData?.map((item) =>
            item._id === recordId ? { ...item, [key]: value } : item
        );
        setEditedData(updatedData)
    }

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'نام محصول',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'product_name', e.target.value)}
                    />
                ) : text
            ),
        },
        {
            title: 'بارکد',
            dataIndex: 'barcode',
            key: 'barcode'
        },
        editingRow === null ? {
            title: 'عکس قدیمی محصول',
            dataIndex: 'picture_old',
            key: 'image',
            render: (text: string) => (
                text === '' ? <p>----</p> :
                    <Tooltip title={<img src={text} alt="Product" style={{ width: '200px' }} />}>
                        <img
                            src={text}
                            alt="Product"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                    </Tooltip>
            ),
        } : {},
        {
            title: 'خوشه',
            dataIndex: 'cluster',
            key: 'cluster',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'cluster', e.target.value)}
                        style={{ width: '150px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'زیر خوشه',
            dataIndex: 'child_cluster',
            key: 'child_cluster',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'child_cluster', e.target.value)}
                        style={{ width: '150px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'برند',
            dataIndex: 'brand',
            key: 'brand',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'brand', e.target.value)}
                    />
                ) : text
            ),
        },
        {
            title: 'per',
            dataIndex: 'per',
            key: 'per',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'per', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'کالری',
            dataIndex: 'calorie',
            key: 'calorie',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'calorie', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'شکر',
            dataIndex: 'sugar',
            key: 'sugar',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'sugar', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'چربی',
            dataIndex: 'fat',
            key: 'fat',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'fat', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'نمک',
            dataIndex: 'salt',
            key: 'salt',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'salt', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'اسید چرب ترانس',
            dataIndex: 'trans_fatty_acids',
            key: 'trans_fatty_acids',
            render: (text: string, record: Product) => (
                editingRow === record._id ? (
                    <Input
                        defaultValue={text}
                        onChange={(e) => handleChangeInput(record._id, 'trans_fatty_acids', e.target.value)}
                        style={{ width: '50px' }}
                    />
                ) : text
            ),
        },
        {
            title: 'عملیات ها',
            key: 'actions',
            render: (_: any, record: Product) => (
                <ActionCell
                    onEdit={() => handleEdit(record)}
                    onSave={() => handleSave(record)}
                    isEditing={editingRow === record._id}
                    onCancel={() => handleCancelEdit()}
                    onOpenModal={() => handleOpenModal()}
                />
            ),
        }
    ]

    return (
        <div style={ProductListStyle}>
            {(data.data && data.data?.length > 0) &&
                <ConfigProvider>
                    <Table
                        dataSource={editedData}
                        columns={columns}
                        style={TableStyle}
                        pagination={{
                            position: ['bottomCenter'],
                            total: +data.totalProducts!,
                            onChange: paginationHandler,
                            showSizeChanger: false,
                        }}
                        scroll={{ x: 'max-content' }}
                    />
                    <Modal
                        title="Edit Record"
                        visible={isModalVisible}
                        onCancel={handleCloseModal}
                        footer={[
                            <Button key="cancel" onClick={handleCloseModal}>
                                Cancel
                            </Button>,
                            <Button key="save" type="primary" onClick={() => { }}>
                                Save
                            </Button>,
                        ]}
                    >
                        <p>Editing record: { }</p>
                    </Modal>
                </ConfigProvider>
            }
        </div >
    );
}

const openNotification = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({
        message,
        description,
        placement: 'topLeft'
    });
};

const ProductListStyle: React.CSSProperties = {
    marginTop: '20px',
    width: '100%',
    minHeight: '500px',
}

const TableStyle: React.CSSProperties = {
    direction: 'rtl',
}

export default ProductList;

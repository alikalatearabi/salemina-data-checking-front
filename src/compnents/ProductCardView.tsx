import { useEffect, useState } from "react";
import { Button, Card, Modal, Input, Pagination, notification } from "antd";
import { Product, updateProduct } from "../api/product";
import { useData } from "../store/dataContext";
import styles from "./productCardViewStyle.module.scss";

const { Meta } = Card;

const ProductCardView = () => {
    const { data, fetchData } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchData({ page: `${currentPage}`, limit: `${productsPerPage}` });
    }, [currentPage]);

    const handleEdit = (product: Product) => {
        setEditingProduct(product._id);
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct);
                notification.success({
                    message: "Update Successful",
                    description: "Product updated successfully.",
                });
                fetchData({ page: `${currentPage}`, limit: `${productsPerPage}` });
            }
        } catch (error) {
            notification.error({
                message: "Update Failed",
                description: "Failed to update the product.",
            });
        }
        setIsModalVisible(false);
        setEditingProduct(null);
    };

    const handleChangeInput = (key: string, value: string) => {
        if (selectedProduct) {
            setSelectedProduct({ ...selectedProduct, [key]: value });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className={styles.flexContainer}>
                {data?.data?.map((product: Product) => (
                    <Card
                        key={product._id}
                        hoverable
                        className={styles.card}
                        cover={
                            <div className={styles.cardCover}>
                                {product.picture_old ? (
                                    <img
                                        alt={product.product_name}
                                        src={product.picture_old}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </div>
                        }
                    >
                        <Meta
                            title={product.product_name}
                            description={
                                <div className={styles.metaDescription}>
                                    <div>بارکد: {product.barcode}</div>
                                    <div>وضعیت داده‌های اصلی: {product.Main_data_status}</div>
                                    <div>وضعیت داده‌های اضافی: {product.Extra_data_status}</div>
                                </div>
                            }
                        />
                        <div className={styles.cardButtonContainer}>
                            <Button type="primary" onClick={() => handleEdit(product)}>
                                مشاهده یا ویرایش
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.paginationContainer}>
                <Pagination
                    current={currentPage}
                    total={Number(data?.totalProducts) || 0}
                    pageSize={productsPerPage}
                    onChange={handlePageChange}
                />
            </div>

            <Modal
                title="Edit Product"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Save
                    </Button>,
                ]}
            >
                {selectedProduct && (
                    <div>
                        <label>Product Name:</label>
                        <Input
                            value={selectedProduct.product_name}
                            onChange={(e) => handleChangeInput("product_name", e.target.value)}
                        />
                        <label>Brand:</label>
                        <Input
                            value={selectedProduct.brand}
                            onChange={(e) => handleChangeInput("brand", e.target.value)}
                        />
                        <label>Cluster:</label>
                        <Input
                            value={selectedProduct.cluster}
                            onChange={(e) => handleChangeInput("cluster", e.target.value)}
                        />
                        {/* Add more fields as needed */}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductCardView;

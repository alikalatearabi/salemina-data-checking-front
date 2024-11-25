import React from "react";
import { Modal, Input, Button } from "antd";
import { Product } from "../../api/product";

interface EditProductModalProps {
    visible: boolean;
    product: Product | null;
    onCancel: () => void;
    onSave: () => void;
    onChange: (key: string, value: string) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
    visible,
    product,
    onCancel,
    onSave,
    onChange,
}) => {
    return (
        <Modal
            title="Edit Product"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={onSave}>
                    Save
                </Button>,
            ]}
        >
            {product && (
                <div>
                    <label>Product Name:</label>
                    <Input
                        value={product.product_name}
                        onChange={(e) => onChange("product_name", e.target.value)}
                    />
                    <label>Brand:</label>
                    <Input
                        value={product.brand}
                        onChange={(e) => onChange("brand", e.target.value)}
                    />
                    <label>Cluster:</label>
                    <Input
                        value={product.cluster}
                        onChange={(e) => onChange("cluster", e.target.value)}
                    />
                    {/* Add more fields as needed */}
                </div>
            )}
        </Modal>
    );
};

export default EditProductModal;

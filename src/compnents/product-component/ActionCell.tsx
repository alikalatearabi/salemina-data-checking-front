import React from 'react';
import { Button } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

interface ActionCellProps {
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
    onOpenModal: () => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ onEdit, onSave, isEditing, onOpenModal, onCancel }) => {
    return (
        <div >
            {isEditing ? (
                <div style={ActionButtonsStyle}>
                    <Button type="primary" icon={<SaveOutlined />} onClick={onSave} style={{
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        color: '#fff',
                    }}>
                        ذخیره
                    </Button>
                    <Button type="primary" icon={<CloseOutlined />} onClick={onCancel} style={{
                        backgroundColor: '#dc3545',
                        borderColor: '#dc3545',
                        color: '#fff',
                    }}>
                        لغو
                    </Button>
                </div>
            ) : (
                <div style={ActionButtonsStyle}>
                    <Button type="default" icon={<EditOutlined />} onClick={onEdit} style={{
                        backgroundColor: '#007bff',
                        borderColor: '#007bff',
                        color: '#fff',
                    }}>
                        ویرایش
                    </Button>
                    <Button type="primary" onClick={onOpenModal} style={{
                        backgroundColor: '#d4edda',
                        color: '#155724'
                    }}>
                        اطلاعات تکمیلی
                    </Button>
                </div>
            )}
        </div>
    );
};

const ActionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
}

export default ActionCell;

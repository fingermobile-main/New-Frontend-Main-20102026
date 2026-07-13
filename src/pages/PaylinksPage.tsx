import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { TrashIcon, GiftIcon, LinkIcon, PaylinkIcon } from '../icons';
import PageHeader from '../components/PageHeader';
import type { Paylink } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PaylinksPage: React.FC = () => {
    const { member } = useAuth();
    const { paylinks = [], showToast, ficBalance, handleDeletePaylink } = useAppContext();
    const [showGiftModal, setShowGiftModal] = React.useState(false);
    const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
    const [selectedPaylink, setSelectedPaylink] = React.useState<Paylink | null>(null);
    const [giftAmount, setGiftAmount] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleSendGift = async (paylinkId: string, amount: string) => {
        if (!member) {
            showToast?.("You must be logged in to send gifts", "error");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            showToast?.("Please enter a valid gift amount", "error");
            return;
        }

        const giftAmountNum = parseFloat(amount);
        if (ficBalance !== undefined && giftAmountNum > ficBalance) {
            showToast?.("Insufficient FIC balance", "error");
            return;
        }

        setIsProcessing(true);
        try {
            // Mock gift sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast?.(`Successfully sent ${amount} FIC gift!`, "success");
            setShowGiftModal(false);
            setGiftAmount('');
        } catch (error) {
            showToast?.("Failed to send gift. Please try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6">
            <PageHeader title="Paylinks" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(paylinks || []).map((paylink: any) => (
                    <div key={paylink.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <PaylinkIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <button 
                                onClick={() => handleDeletePaylink?.(paylink.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{paylink.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{paylink.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-brand-blue">{paylink.amount} FIC</span>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => {
                                        setSelectedPaylink(paylink as any);
                                        setShowGiftModal(true);
                                    }}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Send Gift"
                                >
                                    <GiftIcon className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(paylink.url);
                                        showToast?.("Link copied to clipboard!", "success");
                                    }}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Copy Link"
                                >
                                    <LinkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {paylinks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No paylinks found. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default PaylinksPage;

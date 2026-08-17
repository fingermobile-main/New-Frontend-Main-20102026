import React, {} from 'react';
import { useAppContext } from "../contexts/AppContext";
import { CouponsIcon } from '../icons';
import type { Coupon } from '../types';

const CouponsPage: React.FC = () => {
  const { memberCoupons, handleSecureClaimCoupon } = useAppContext();

  const availableCoupons = (memberCoupons || []).filter(
    (c: Coupon) => (c as any).status === "Available" && new Date((c as any).expiryDate) >= new Date(),
  );
  const claimedOrExpiredCoupons = (memberCoupons || []).filter(
    (c: Coupon) => (c as any).status === "Claimed" || new Date((c as any).expiryDate) < new Date(),
  );

  const CouponCard: React.FC<{ coupon: Coupon }> = ({ coupon }) => {
    const isExpired = new Date((coupon as any).expiryDate) < new Date();
    const isAvailable = (coupon as any).status === "Available" && !isExpired;

    return (
      <div
        className={`relative bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition-opacity ${!isAvailable && "opacity-60"}`}
      >
        <div className="absolute top-0 left-0 h-full w-2 bg-brand-blue rounded-l-xl"></div>
        <div className="pl-4">
          <p className="font-bold text-lg text-gray-800">
            {(coupon as any).campaignTitle}
          </p>
          <p className="text-sm text-gray-500">
            Value:{" "}
            <span className="font-semibold text-green-600">
              {(coupon as any).value.toLocaleString()} FIC
            </span>
          </p>
          <p className="text-xs text-gray-400">Expires: {(coupon as any).expiryDate}</p>
        </div>
        {isAvailable ? (
          <button
            onClick={() => handleSecureClaimCoupon?.(coupon.id)}
            className="px-6 py-2 font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Claim
          </button>
        ) : (
          <span className="px-6 py-2 font-semibold bg-gray-200 text-gray-500 rounded-full cursor-not-allowed">
            {isExpired ? "Expired" : "Claimed"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <CouponsIcon className="w-10 h-10 text-brand-blue" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Coupons
          </h1>
          <p className="text-gray-600">
            Claim your rewards from campaigns and special offers.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Available</h2>
          <div className="space-y-4">
            {availableCoupons.length > 0 ? (
              availableCoupons.map((coupon: Coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                You have no available coupons right now.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {claimedOrExpiredCoupons.length > 0 ? (
              claimedOrExpiredCoupons.map((coupon: Coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                Your coupon history is empty.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;

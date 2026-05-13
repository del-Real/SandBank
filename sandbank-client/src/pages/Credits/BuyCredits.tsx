import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createCheckout, type CreditPack } from "../../api/paymentsApi";

const PACKS = [
  { id: "starter", label: "Starter", credits: 10, price: "€5" },
  { id: "standard", label: "Standard", credits: 25, price: "€10" },
  { id: "pro", label: "Pro", credits: 60, price: "€20" },
];

export function BuyCredits() {
  const [loading, setLoading] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const handleBuy = async (pack: CreditPack) => {
    setLoading(pack);
    try {
      const res = await createCheckout(pack);
      // redirect to Stripe hosted checkout page
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Failed to start checkout");
      setLoading(null);
    }
  };

  return (
    <>
      <div className="page-header">
        <h3>Buy Time Credits</h3>
      </div>

      {status === "success" && (
        <p
          className="badge badge-completed"
          style={{ marginBottom: "1rem", display: "inline-block" }}
        >
          Payment successful! Credits will appear in your balance shortly.
        </p>
      )}
      {status === "cancelled" && (
        <p
          className="badge badge-cancelled"
          style={{ marginBottom: "1rem", display: "inline-block" }}
        >
          Payment cancelled.
        </p>
      )}

      <div className="packs-grid">
        {PACKS.map((pack) => (
          <div key={pack.id} className="pack-card">
            <h4>{pack.label}</h4>
            <p className="pack-credits">{pack.credits} credits</p>
            <p className="pack-price">{pack.price}</p>
            <button
              onClick={() => handleBuy(pack.id as CreditPack)}
              disabled={loading === pack.id}
            >
              {loading === pack.id ? "Redirecting..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', text: '#fd7e14', label: 'Pending' },
  approved: { bg: '#d3f9d8', text: '#37b24d', label: 'Approved' },
  rejected: { bg: '#ffe3e3', text: '#f03e3e', label: 'Rejected' },
  completed: { bg: '#e8ecfd', text: '#4c6ef5', label: 'Completed' },
};

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status] || { bg: '#e9ecef', text: '#495057', label: status };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '20px',
      }}
    >
      {config.label}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #868e96',
        borderRadius: '10px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            margin: '0 0 16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e9ecef',
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          marginBottom: '4px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '15px',
          color: '#212529',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewAction, setReviewAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/return-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load return request.');
        const data = await res.json();
        setReturnRequest(data.returnRequest || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  function validate() {
    const errors = {};
    if (!reviewAction) errors.reviewAction = 'Please select an action.';
    return errors;
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: reviewAction,
          adminNotes: adminNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review.');
      }
      setReturnRequest(data.returnRequest || data);
      setSubmitSuccess(
        reviewAction === 'approve'
          ? 'Return request approved successfully.'
          : 'Return request rejected successfully.'
      );
      setReviewAction('');
      setAdminNotes('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isPending = returnRequest?.status === 'pending';

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#495057',
          fontSize: '16px',
        }}
      >
        Loading return request…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#ffe3e3',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '16px',
              color: '#f03e3e',
              fontSize: '15px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
          <button
            onClick={() => navigate('/admin/returns')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4c6ef5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Back to Returns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Back link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/admin/returns"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#4c6ef5',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <img src="/src/assets/icons/chevron-left.svg" alt="" style={{ width: '16px', height: '16px' }} />
            Back to Return Requests
          </Link>
        </div>

        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 8px',
              }}
            >
              Return Request{' '}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '20px',
                }}
              >
                #{id}
              </span>
            </h1>
            {returnRequest && (
              <StatusBadge status={returnRequest.status} />
            )}
          </div>
        </div>

        {/* Success / Error banners */}
        {submitSuccess && (
          <div
            style={{
              backgroundColor: '#d3f9d8',
              border: '1px solid #37b24d',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#37b24d',
              fontSize: '14px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#f03e3e',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {submitError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          {/* Left column */}
          <div>
            {/* Return Details */}
            <SectionCard title="Return Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <Field label="Request ID" value={`#${returnRequest?.id}`} mono />
                <Field
                  label="Order ID"
                  value={
                    returnRequest?.orderId ? (
                      <Link
                        to={`/admin/orders/${returnRequest.orderId}`}
                        style={{ color: '#4c6ef5', textDecoration: 'none' }}
                      >
                        #{returnRequest.orderId}
                      </Link>
                    ) : null
                  }
                  mono
                />
                <Field
                  label="Status"
                  value={<StatusBadge status={returnRequest?.status} />}
                />
                <Field
                  label="Requested On"
                  value={
                    returnRequest?.createdAt
                      ? new Date(returnRequest.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : null
                  }
                />
                <Field
                  label="Reviewed On"
                  value={
                    returnRequest?.reviewedAt
                      ? new Date(returnRequest.reviewedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : null
                  }
                />
              </div>
              <div style={{ marginTop: '4px' }}>
                <Field label="Reason" value={returnRequest?.reason} />
                {returnRequest?.description && (
                  <Field label="Additional Details" value={returnRequest.description} />
                )}
                {returnRequest?.adminNotes && (
                  <Field label="Admin Notes" value={returnRequest.adminNotes} />
                )}
              </div>
            </SectionCard>

            {/* Customer Info */}
            <SectionCard title="Customer Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <Field
                  label="Name"
                  value={returnRequest?.customerName || returnRequest?.user?.name}
                />
                <Field
                  label="Email"
                  value={returnRequest?.customerEmail || returnRequest?.user?.email}
                />
                <Field
                  label="Phone"
                  value={returnRequest?.customerPhone || returnRequest?.user?.phone}
                />
              </div>
            </SectionCard>

            {/* Return Items */}
            {returnRequest?.items && returnRequest.items.length > 0 && (
              <SectionCard title="Return Items">
                <div>
                  {returnRequest.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        paddingBottom: idx < returnRequest.items.length - 1 ? '16px' : 0,
                        marginBottom: idx < returnRequest.items.length - 1 ? '16px' : 0,
                        borderBottom:
                          idx < returnRequest.items.length - 1 ? '1px solid #e9ecef' : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <img
                        src={item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                        alt={item.productName || 'Product'}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e9ecef',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: '0 0 4px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#212529',
                          }}
                        >
                          {item.productName || '—'}
                        </p>
                        {item.sku && (
                          <p
                            style={{
                              margin: '0 0 4px',
                              fontSize: '12px',
                              color: '#495057',
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            }}
                          >
                            SKU: {item.sku}
                          </p>
                        )}
                        <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>
                          Qty: {item.quantity} &nbsp;·&nbsp; ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Evidence Images */}
            {returnRequest?.evidenceImages && returnRequest.evidenceImages.length > 0 && (
              <SectionCard title="Evidence Images">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {returnRequest.evidenceImages.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #868e96',
                          cursor: 'pointer',
                        }}
                      />
                    </a>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* Right column — Review Panel */}
          <div>
            {isPending ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #868e96',
                  borderRadius: '10px',
                  padding: '24px',
                  position: 'sticky',
                  top: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#212529',
                    margin: '0 0 16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e9ecef',
                  }}
                >
                  Review Decision
                </h2>

                <form onSubmit={handleSubmitReview} noValidate>
                  {/* Action selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#495057',
                        marginBottom: '8px',
                      }}
                    >
                      Action <span style={{ color: '#f03e3e' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 14px',
                          border: `2px solid ${
                            reviewAction === 'approve' ? '#37b24d' : '#868e96'
                          }`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor:
                            reviewAction === 'approve' ? '#d3f9d8' : '#ffffff',
                          transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="radio"
                          name="reviewAction"
                          value="approve"
                          checked={reviewAction === 'approve'}
                          onChange={(e) => {
                            setReviewAction(e.target.value);
                            setFormErrors((prev) => ({ ...prev, reviewAction: undefined }));
                          }}
                          style={{ accentColor: '#37b24d', width: '18px', height: '18px' }}
                        />
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#37b24d',
                          }}
                        >
                          Approve
                        </span>
                      </label>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 14px',
                          border: `2px solid ${
                            reviewAction === 'reject' ? '#f03e3e' : '#868e96'
                          }`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor:
                            reviewAction === 'reject' ? '#ffe3e3' : '#ffffff',
                          transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="radio"
                          name="reviewAction"
                          value="reject"
                          checked={reviewAction === 'reject'}
                          onChange={(e) => {
                            setReviewAction(e.target.value);
                            setFormErrors((prev) => ({ ...prev, reviewAction: undefined }));
                          }}
                          style={{ accentColor: '#f03e3e', width: '18px', height: '18px' }}
                        />
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#f03e3e',
                          }}
                        >
                          Reject
                        </span>
                      </label>
                    </div>
                    {formErrors.reviewAction && (
                      <p
                        style={{
                          margin: '6px 0 0',
                          fontSize: '13px',
                          color: '#f03e3e',
                        }}
                        role="alert"
                      >
                        {formErrors.reviewAction}
                      </p>
                    )}
                  </div>

                  {/* Admin Notes */}
                  <div style={{ marginBottom: '24px' }}>
                    <label
                      htmlFor="admin-notes"
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#495057',
                        marginBottom: '8px',
                      }}
                    >
                      Admin Notes
                    </label>
                    <textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Optional notes for internal reference or customer communication…"
                      rows={4}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        border: '1px solid #868e96',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#212529',
                        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                        lineHeight: '1.5',
                        resize: 'vertical',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4c6ef5')}
                      onBlur={(e) => (e.target.style.borderColor = '#868e96')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      backgroundColor: submitting ? '#adb5bd' : '#4c6ef5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      minHeight: '44px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#3b5bdb';
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#4c6ef5';
                    }}
                  >
                    {submitting ? 'Submitting…' : 'Submit Decision'}
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #868e96',
                  borderRadius: '10px',
                  padding: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#212529',
                    margin: '0 0 16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e9ecef',
                  }}
                >
                  Review Decision
                </h2>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#495057' }}>
                    This request has already been reviewed.
                  </p>
                  <StatusBadge status={returnRequest?.status} />
                </div>
                {returnRequest?.adminNotes && (
                  <div style={{ marginTop: '16px' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#495057',
                        marginBottom: '6px',
                      }}
                    >
                      Admin Notes
                    </span>
                    <p style={{ margin: 0, fontSize: '14px', color: '#343a40', lineHeight: '1.5' }}>
                      {returnRequest.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

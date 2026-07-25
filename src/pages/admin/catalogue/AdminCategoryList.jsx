import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import plusIcon from '@/assets/icons/plus.svg';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';

const API_BASE = '/api';

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

async function deleteCategory(categoryId) {
  const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

function buildTree(categories) {
  const map = {};
  categories.forEach((c) => (map[c.id] = { ...c, children: [] }));
  const roots = [];
  categories.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].children.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

function CategoryRow({ node, depth, onDelete }) {
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <td style={{ padding: '10px 16px', color: '#212529', paddingLeft: `${16 + depth * 24}px` }}>
          {depth > 0 && <span style={{ color: '#868e96', marginRight: '8px' }}>{'└'}</span>}
          {node.name}
        </td>
        <td style={{ padding: '10px 16px', color: '#495057', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '12px' }}>{node.slug}</td>
        <td style={{ padding: '10px 16px', color: '#495057' }}>{node.parent_id || '—'}</td>
        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => navigate(`/admin/catalogue/categories/${node.id}/edit`)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#e8ecfd', color: '#4c6ef5', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <img src={editIcon} alt="" width={13} height={13} />
              Edit
            </button>
            <button onClick={() => onDelete(node.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#ffe3e3', color: '#f03e3e', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <img src={trashIcon} alt="" width={13} height={13} />
              Delete
            </button>
          </div>
        </td>
      </tr>
      {node.children.map((child) => <CategoryRow key={child.id} node={child} depth={depth + 1} onDelete={onDelete} />)}
    </>
  );
}

export default function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((data) => {
        const cats = data.categories || data.data || data;
        setCategories(cats);
        setTree(buildTree(cats));
      })
      .catch(() => setError('Could not load categories.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(categoryId) {
    if (!window.confirm('Delete this category?')) return;
    setDeleteError('');
    try {
      await deleteCategory(categoryId);
      const updated = categories.filter((c) => c.id !== categoryId);
      setCategories(updated);
      setTree(buildTree(updated));
    } catch {
      setDeleteError('Could not delete category.');
    }
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Categories</h1>
          <Link
            to="/admin/catalogue/categories/new"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4c6ef5', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            <img src={plusIcon} alt="" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} />
            New Category
          </Link>
        </div>

        {deleteError && <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{deleteError}</div>}
        {error && <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>Loading…</div>
          ) : tree.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>No categories found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #868e96' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Parent ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tree.map((node) => <CategoryRow key={node.id} node={node} depth={0} onDelete={handleDelete} />)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

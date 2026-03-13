

export default function StubPage({ title }: { title: string }) {
    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>{title}</h1>
            <div style={{
                padding: '48px',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                color: '#64748b'
            }}>
                This page is under construction as part of the system refactor.
            </div>
        </div>
    );
}

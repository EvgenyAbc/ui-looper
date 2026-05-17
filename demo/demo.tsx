/**
 * @ui-looper/core — Demo Page
 *
 * Shows all components for visual debugging during development.
 * Accessed at http://localhost:3030/demo.html (dev only).
 */
import { StrictMode, useCallback,useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Badge } from '../src/Badge';
// Components are imported directly (not via MF) in dev mode.
import { Button } from '../src/Button';
import { Card, CardBody, CardFooter,CardHeader } from '../src/Card';
import { Input } from '../src/Input';
import { Modal } from '../src/Modal';
import { Select } from '../src/Select';
import { Spinner } from '../src/Spinner';
import { Tag } from '../src/Tag';
import { ToastItemComponent } from '../src/Toast';
import { Tooltip } from '../src/Tooltip';
import { Heading,Text } from '../src/Typography';

// Styles
import '../src/styles/tokens.css';
import '../src/styles/primitives.css';

/* ═══════════════════════════════════════════════════════════════
 *  Styles
 *  ═══════════════════════════════════════════════════════════════ */

const pageStyle: React.CSSProperties = {
  padding: '2rem',
  maxWidth: 960,
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '2.5rem',
  padding: '1.5rem',
  border: '1px solid var(--uil-border, #e0e0e0)',
  borderRadius: 12,
  background: 'var(--uil-bg, #fff)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: '0.75rem',
};

const colStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '0.75rem',
  alignItems: 'flex-start',
};

/* ═══════════════════════════════════════════════════════════════
 *  Theme Toggle
 *  ═══════════════════════════════════════════════════════════════ */

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);
  return { theme, toggle };
}

/* ═══════════════════════════════════════════════════════════════
 *  Demo App
 *  ═══════════════════════════════════════════════════════════════ */

function App() {
  const { theme, toggle } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState<string | number>('');

  const countries = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
  ];

  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'warning' | 'error' }>>([]);

  const addToast = (type: 'info' | 'success' | 'warning' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, message: `Toast ${type}`, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Heading as="h1">@ui-looper/core</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button variant="ghost" size="sm" onClick={toggle}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Button>
          <Text variant="caption" color="secondary">v1.0.0 — {theme} theme</Text>
        </div>
      </div>

      {/* ── Button ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Button</Heading>
        <div style={rowStyle}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div style={rowStyle}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div style={rowStyle}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" loading>Loading outline</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </section>

      {/* ── Spinner ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Spinner</Heading>
        <div style={rowStyle}>
          <Spinner />
          <Spinner size="sm" />
          <Spinner size="lg" />
        </div>
        <div style={rowStyle}>
          <Spinner variant="primary" />
          <Spinner variant="accent" />
          <Spinner variant="current" />
        </div>
      </section>

      {/* ── Typography ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Typography</Heading>
        <div style={{ marginTop: '0.5rem' }}>
          <Heading as="h1">Heading h1</Heading>
          <Heading as="h2">Heading h2</Heading>
          <Heading as="h3">Heading h3</Heading>
          <Heading as="h4">Heading h4</Heading>
          <Heading as="h5">Heading h5</Heading>
          <Heading as="h6">Heading h6</Heading>
        </div>
        <div style={colStyle}>
          <Text>Body text (default)</Text>
          <Text variant="caption">Caption text</Text>
          <Text variant="label">Label text</Text>
          <Text variant="help">Help text</Text>
          <Text variant="error">Error text</Text>
          <Text weight="bold">Bold text</Text>
          <Text color="secondary">Secondary colour</Text>
          <Text color="accent">Accent colour</Text>
        </div>
      </section>

      {/* ── Input ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Input</Heading>
        <div style={colStyle}>
          <Input label="Default" placeholder="Enter text…" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
          <Input label="With error" status="error" helper="This field is required" placeholder="Error state" />
          <Input label="With warning" status="warning" helper="Check this value" placeholder="Warning state" />
          <Input label="With success" status="success" helper="Looks good!" placeholder="Success state" />
          <Input label="With prefix" prefix="🔍" placeholder="Search…" />
          <Input label="With suffix" suffix="📅" placeholder="Date" />
          <Input label="Filled" variant="filled" placeholder="Filled variant" />
          <Input label="Ghost" variant="ghost" placeholder="Ghost variant" />
          <Input label="Disabled" disabled value="Cannot edit" />
        </div>
      </section>

      {/* ── Tag ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Tag</Heading>
        <div style={rowStyle}>
          <Tag variant="default">Default</Tag>
          <Tag variant="primary">Primary</Tag>
          <Tag variant="accent">Accent</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="danger">Danger</Tag>
        </div>
        <div style={rowStyle}>
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
          <Tag onClose={() => alert('Closed!')}>Removable</Tag>
        </div>
      </section>

      {/* ── Badge ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Badge</Heading>
        <div style={rowStyle}>
          <Badge count={3} variant="danger">
            <Button size="sm" variant="outline">Inbox</Button>
          </Badge>
          <Badge count={42} variant="accent">
            <Button size="sm" variant="outline">Notifications</Button>
          </Badge>
          <Badge mode="dot" variant="success" standalone />
          <Badge mode="text" text="NEW" variant="accent" standalone />
        </div>
      </section>

      {/* ── Card ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Card</Heading>
        <div style={{ maxWidth: 400, marginTop: '0.75rem' }}>
          <Card variant="default">
            <CardHeader>Card Header</CardHeader>
            <CardBody>
              This is the card body content. Cards can have header, body, and footer sections.
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="primary">Save</Button>
              <Button size="sm" variant="ghost">Cancel</Button>
            </CardFooter>
          </Card>
        </div>
        <div style={{ maxWidth: 400, marginTop: '0.75rem' }}>
          <Card variant="outlined">
            <CardBody noPadding>
              <div style={{ padding: '1rem' }}>Card with noPadding body + outlined</div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* ── Tooltip ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Tooltip</Heading>
        <div style={rowStyle}>
          <Tooltip title="Tooltip on top">
            <Button variant="outline" size="sm">Hover top</Button>
          </Tooltip>
          <Tooltip title="Tooltip on bottom" placement="bottom">
            <Button variant="outline" size="sm">Hover bottom</Button>
          </Tooltip>
          <Tooltip title="Tooltip on left" placement="left">
            <Button variant="outline" size="sm">Hover left</Button>
          </Tooltip>
          <Tooltip title="Tooltip on right" placement="right">
            <Button variant="outline" size="sm">Hover right</Button>
          </Tooltip>
          <Tooltip title="Click to see" trigger="click">
            <Button variant="outline" size="sm">Click me</Button>
          </Tooltip>
        </div>
      </section>

      {/* ── Select ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Select</Heading>
        <div style={colStyle}>
          <div style={{ width: 280 }}>
            <Text variant="label" style={{ marginBottom: 4, display: 'block' }}>Single</Text>
            <Select
              options={countries}
              value={selectVal}
              onChange={(v) => setSelectVal(v as string)}
              placeholder="Select a country"
            />
          </div>
          <div style={{ width: 280 }}>
            <Text variant="label" style={{ marginBottom: 4, display: 'block' }}>Multiple</Text>
            <Select
              mode="multiple"
              options={countries}
              placeholder="Select countries"
              maxTagCount={2}
            />
          </div>
          <div style={{ width: 280 }}>
            <Text variant="label" style={{ marginBottom: 4, display: 'block' }}>Searchable</Text>
            <Select
              searchable
              options={countries}
              placeholder="Search countries…"
            />
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Modal</Heading>
        <div style={rowStyle}>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>Small size</Button>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal Title" size="sm">
          <Text>This is a modal dialog. Click outside or press ESC to close.</Text>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </section>

      {/* ── Toast ── */}
      <section style={sectionStyle}>
        <Heading as="h3">Toast (inline demo)</Heading>
        <div style={rowStyle}>
          <Button variant="accent" size="sm" onClick={() => addToast('info')}>Info</Button>
          <Button variant="primary" size="sm" onClick={() => addToast('success')}>Success</Button>
          <Button variant="outline" size="sm" onClick={() => addToast('warning')}>Warning</Button>
          <Button variant="danger" size="sm" onClick={() => addToast('error')}>Error</Button>
        </div>
        <div style={{ maxWidth: 360, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {toasts.map((t) => (
            <ToastItemComponent
              key={t.id}
              item={{
                id: String(t.id),
                type: t.type,
                message: t.message,
                duration: 3000,
                createdAt: t.id,
              }}
              onDismiss={(id) => setToasts((prev) => prev.filter((to) => String(to.id) !== id))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  Mount
 *  ═══════════════════════════════════════════════════════════════ */

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Footer } from './components/Footer/Footer';
export const App = () => {
    return (_jsxs(_Fragment, { children: [_jsx("a", { href: "#main", className: "skip-link", children: "Skip to main content" }), _jsx(Header, {}), _jsx("main", { id: "main", style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: _jsx(Hero, {}) }), _jsx(Footer, {})] }));
};
export default App;

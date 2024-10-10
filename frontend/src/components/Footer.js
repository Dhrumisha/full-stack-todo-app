import React from 'react';
import './Footer.css';

export default function Footer({ completedTodos, totalTodos }) {
    return (
        <div className="footer">
            <span className="color-code">Total Todo List: {totalTodos}</span>
            <span className="color-code">Completed Todos: {completedTodos}</span>
        </div>
    );
}

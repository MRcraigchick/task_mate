import { createContext, useContext, useReducer } from 'react';

const DateObjContext = createContext(undefined);

export function DateObjContextProvider ({ value, children }) {
    return <DateObjContext.Provider value={ value }>{ children }</DateObjContext.Provider>;
}

export function useDateObj () {
    const context = useContext(DateObjContext);
    if (!context) {
        throw new Error('useDateObj must be used within a DateObjContextProvider');
    }
    return context;
}

import './App.css'
import FilterList from './compnents/FilterList'
import AppLayout from './compnents/Layout/Layout'
import ProductCardView from './compnents/product-component/ProductCardView'

function App() {

  return (
    <AppLayout>
      <div style={mainContentStyle}>
        <FilterList />
        <ProductCardView />
      </div>
    </AppLayout>
  )
}

const mainContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  flexDirection: 'column',
}

export default App

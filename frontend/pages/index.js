import Head from "next/head"
import axios from "axios"
import { useEffect, useState } from "react"
import ItemList from "../src/component/itemList"
import { Divider, Header } from "semantic-ui-react"

const home = () => {
  const API_URL = "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline"
  const [list, setList] = useState([])

  const getData = () => {
    axios.get(API_URL).then((res) => {
      setList(res.data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <Head>
        <title>NextJS 페이지</title>
      </Head>
      <Header as="h3" style={{paddingTop : 40}}>베스트 상품</Header>
      <ItemList list={list.slice(0,9)}/>
      <Divider />
      <Header as="h3" style={{paddingTop : 60}}>신상품</Header>
      <ItemList list={list.slice(9)}/>
    </div>
  )
}

export default home
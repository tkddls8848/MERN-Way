import { Button } from "semantic-ui-react"

const item = (item) => {
    console.log("item : ", item)
    return <div>
                <img src={item.item.image_link} key={item.item.id}></img>
                <div>
                    <strong>name : {item.item.name}</strong>
                    <Button primary>구매하기</Button>
                </div>
                <p>description : {item.item.description}</p>
            </div>
}

export default item

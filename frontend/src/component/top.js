import Gnb from "./gnb"
import { Header } from "semantic-ui-react"

const Top = () => {
    return (
        <div>
            <div style={{ display: "flex", paddingTop: 20 }}>
                <div style={{ flex: "100px 0 0" }}>
                <img
                    src="/images/sample.jpg"
                    alt="logo"
                    style={{ display: "block", width: 80 }}
                />
                </div>
                <Header as="h2">This is Header</Header>
            </div>
            <Gnb />
        </div>

        )
}

export default Top
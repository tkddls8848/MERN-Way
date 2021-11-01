import {Router} from 'express'

const router =  Router()

router.get('/', (request, response) => {
    response.send("route page")
})

export default router
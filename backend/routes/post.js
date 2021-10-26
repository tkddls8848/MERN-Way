import {Router} from 'express'

const router =  Router()

router.get('/post', (request, response) => {
    response.send("post page")
})

export default router
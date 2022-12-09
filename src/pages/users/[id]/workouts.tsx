import {useRouter} from "next/router"

import {trpc} from "src/utils/trpc"

const Workouts = () => {

  const router = useRouter()

  const id = router.query.id as string

  const {data} = trpc.workout.getPublicWorkouts.useQuery({
    id
  })

  console.log("data" ,data)

  return (
    <div>Workouts</div>
  )
}

export default Workouts

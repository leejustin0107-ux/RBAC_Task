import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get("/", authenticate, authorize("manager"),(req, res) => {
    return res.status(200).json({
      reports: [
        {
          id: 1,
          title: "Monthly User Activity",
          status: "Completed",
          date: "2026-09-01",
        },
        {
          id: 2,
          title: "System Usage Summary",
          status: "Completed",
          date: "2026-09-10",
        },
        {
          id: 3,
          title: "September Performance",
          status: "Processing",
          date: "2026-09-28",
        },
      ],
    });
  }
);

export default router;
const tasks_array=require('../models/tasksdata');

exports.addtask=async (req, res) => {
    try {
      const email = req.body.email;
      const result = await tasks_array
        .findOne({ email: email })
        .select("email")
        .lean();
      if (result) {
        const dates = new Date().toJSON().slice(0, 10);
        await tasks_array
          .findOne({ email: email })
          .updateOne({
            $push: {
              tasks: {
                id: req.body.id,
                task: req.body.task,
                iscompleted: false,
                datecreated: dates,
                datecompleted: "00-00-0000",
                dealine: req.body.deadline,
              },
            },
          })
          .exec();
        return res.status(201).json({
          message: "successful",
        });
      } else {
        const dates = new Date().toJSON().slice(0, 10);
        const Taskadd = new tasks_array({
          email: req.body.email,
          wallet: generateAddress().toString(),
          tasks: [
            {
              id: req.body.id,
              task: req.body.task,
              iscompleted: false,
              datecreated: dates,
              datecompleted: "00-00-0000",
              deadline: req.body.deadline,
            },
          ],
        });
        await Taskadd.save();
        return res.status(201).json({
          message: "task added",
        });
      }
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  };

exports.gettask=async (req, res) => {
    try {
      const data = await tasks_array
        .find({ email: req.query.email })
        .select({ email: 0, _id: 0, __v: 0 });
      return res.status(202).json({
        data,
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  };

exports.deletetask=async (req, res) => {
    try {
      await tasks_array
        .findOne({ email: req.body.email })
        .updateOne({
          $pull: {
            tasks: {
              id: req.body.id,
            },
          },
        })
        .exec();
      return res.status(202).json({
        message: "deleted successfully",
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  };

exports.complete= async (req, res) => {
    try {
      await tasks_array.findOne({ email: req.body.email }).updateOne(
        { "tasks.id": req.body.id },
        {
          $set: {
            "tasks.$.iscompleted": true,
          },
        }
      );
      const deadlines = await tasks_array.findOne({ email: req.body.email });
      deadlines.tasks.forEach(async (element) => {
        if (element.id == req.body.id) {
          const date = new Date();
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${year}-${month}-${day}`;
          if (element.deadline > currentDate) {
            await tasks_array
              .findOne({ email: req.body.email })
              .updateOne({ $inc: { coins: 10 } });
          } else {
            await tasks_array
              .findOne({ email: req.body.email })
              .updateOne({ $inc: { coins: -10 } });
          }
        }
      });
      return res.status(202).json({
        message: "success",
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  };

exports.modifytask= async (req, res) => {
    try {
      await tasks_array.findOne({ email: req.body.email }).updateOne(
        { "tasks.id": req.body.id },
        {
          $set: {
            "tasks.$.task": req.body.task,
          },
        }
      );
      return res.status(202).json({
        message: "success",
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

exports.coins= async(req,res)=>{
  try{
    const data = await tasks_array
        .find({ email: req.query.email })
        .select({ email: 0, _id: 0, __v: 0,tasks:0,wallet:0 });
      return res.status(202).json({
        data
      });
  }catch(err){
    return res.status(404).json({
      message: err.message,
    });
  }
}

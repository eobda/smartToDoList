const express = require("express");
const router = express.Router();
const toDoQueries = require("../db/queries/to_dos");
const categoryQueries = require("../db/queries/categories");
const categorizeItem = require("../server/categorizeItem");

router.get("/", (req, res) => {
  toDoQueries
    .getToDos(1)
    .then((toDos) => {
      res.json({ toDos });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});


router.post("/", async (req, res) => {
  try {
    if (!req.body.text || req.body.text.trim() === "") {
      return res
        .status(400)
        .json({ error: "Invalid request: no data in POST body" });
    }

    const toDoName = req.body.text;
    const suggestedCategory = await categorizeItem(toDoName);

    console.log("Suggested Category:", suggestedCategory);

    if (!suggestedCategory.startsWith("To ")) {
      return res.json({ message: suggestedCategory });
    }

    const data = await categoryQueries.getCategoryByName(suggestedCategory);

    console.log("Category Data:", data);

    if (data && data.length > 0) {
      const categoryId = data[0].id;
      const currentTimestamp = new Date();

      const toDo = {
        toDoName,
        categoryId,
        user_id: 1,
        created_at: currentTimestamp,
      };

      await toDoQueries.addToDo(toDo);
      res.status(201).send();
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;

  toDoQueries
    .getToDos(userId)
    .then((toDos) => {
      res.json({ toDos });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    })

});

router.post("/:id", (req, res) => {
  const toDoId = req.params.id;
  const newCategoryId = req.body.categoryId;

  toDoQueries
    .editToDo({ id: toDoId, category_id: newCategoryId })
    .then((editedToDo) => {
      // Check if a to-do item was edited
      if (editedToDo.length > 0) {
        console.log('To-do item edited successfully', editedToDo);
        res.redirect('/')
      } else {
        res.status(404).json({ error: 'To-do item not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});


router.post("/:id/delete", (req,res) => {
  const toDoId = req.params.id;
  toDoQueries
  .deleteToDo(toDoId)
  .then((deletedToDo) => {
    if (deletedToDo.length > 0) {
      res.json({ message: 'To-do item deleted successfully', deletedToDo });
    } else {
      res.status(404).json({ error: 'Todo-item not found' });
    }
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });

});

module.exports = router;

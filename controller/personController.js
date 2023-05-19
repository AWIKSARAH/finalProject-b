import PersonModel from "../model/personModel.js";

export async function getAllPersons(req, res) {
  try {
    const persons = await PersonModel.paginate();

    if (persons.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No persons found" });
    }

    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, error: error});
  }
}

export async function createPerson(req, res) {
  try {
    const person = new PersonModel(req.body);
    const createdPerson = await person.save();

    res.status(201).json({ success: true, data: createdPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

// Controller function to get a person by ID
export async function getPersonById(req, res) {
  try {
    const { id } = req.params;
    const person = await PersonModel.findById(id);

    if (!person) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function updatePerson(req, res) {
  try {
    const { id } = req.params;
    const updatedPerson = await PersonModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPerson) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, data: updatedPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function deletePerson(req, res) {
  try {
    const { id } = req.params;
    const deletedPerson = await PersonModel.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, deletedPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

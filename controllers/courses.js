const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc            Get all courses
// @route           GET /api/v1/courses
// @route           GET /api/v1/bootcamps/:bootcampId/courses
// @access          Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advancedResult);
  }
});

// @desc            Get course by id
// @route           GET /api/v1/courses/:id
// @access          Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc            Create new bootcamp
// @route           POST /api/v1/bootcamps/:bootcampId/course
// @access          Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp not found with id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc            Update new course
// @route           PUT /api/v1/courses/:id
// @access          Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc            Delete new course
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

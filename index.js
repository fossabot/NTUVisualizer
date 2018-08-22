const rp = require('request-promise');
const cheerio = require('cheerio');

const ExamTimetablePublic = {
  uri: 'https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.MainSubmit',
  method: 'POST',
  form:{
  	p_opt: '1',
  	bOption: 'Next'
  },
  headers: {
    'content-type': 'application/x-www-form-urlencoded'  // Is set automatically
  },
  transform: function (body) {
    return cheerio.load(body);
  }
};

const ExamTimetableTimePeriod = {
  uri: 'https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.Get_detail',
  method: 'POST',
  form:{
  	p_exam_dt: '',
	p_start_time: '',
	p_dept: '',
	p_subj: '',
	p_venue: '',
	p_matric: '',
	academic_session: 'Semester 1 Academic Year 2018-2019',
	p_plan_no: '3',
	p_exam_yr: '2018',
	p_semester: '1',
	bOption: 'Next',
  },
  headers: {
    'content-type': 'application/x-www-form-urlencoded'  // Is set automatically
  },
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(ExamTimetableTimePeriod)
  .then(($) => {
    $('table tbody tr').each(function(i, elem) {
  		console.log($(this).text() + "      asd");
  		$('table tbody tr').each(function(i, elem) {
  			console.log($(this).text() + "      asd");
		});
	});
  })
  .catch((err) => {
    console.log(err);
  });




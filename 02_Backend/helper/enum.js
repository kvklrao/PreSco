exports.roles= {
    super_admin: 1,
    hospital_admin: 2,
    hospital_branch_admin: 3,
  };
  
exports.userType= {
  super_admin:1,
  hospital:2,
  hospital_branch:3,
  hospital_staff:4,
  referral_doctor:5,
  patient:6,
  aasha:7,
  PSC:8
  };
  
  exports.parentUserType= {
    super_admin:1,
    hospital:2,
    hospital_branch:3,
    hospital_staff:4,
    referral_doctor:5,
    patient:6
    };

    exports.permissions= {
      dataEntry_review_permission:1,
      scoreGenerate: 2
    };

    exports.action_status={
      request_initiation:1,
      pending_initiation:2,
      accept_initiation:3,
      active:4
    }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Languages (Valid UUIDs)
    const langCSharp = 'c8b2111d-440d-402a-928d-93c4e3370f1a';
    const langPython = 'f8e36e1b-4b1d-4f1e-9b1b-6d1e4e3b70f2';
    const langJS = 'a8e36e1c-4c1d-4f1e-9b1c-6d1e4e3c70f3';

    await queryInterface.bulkInsert('languages', [
      { id: langCSharp, name: 'C#', slug: 'csharp', created_at: new Date(), updated_at: new Date() },
      { id: langPython, name: 'Python', slug: 'python', created_at: new Date(), updated_at: new Date() },
      { id: langJS, name: 'JavaScript', slug: 'javascript', created_at: new Date(), updated_at: new Date() }
    ]);

    // 2. Difficulty Levels
    const diffEasy = 'e8e36e1d-4d1d-4f1e-9b1d-6d1e4e3d70f4';
    const diffMedium = 'b8e36e1e-4e1d-4f1e-9b1e-6d1e4e3e70f5'; // Fixed starting char
    const diffHard = 'd8e36e1f-4f1d-4f1e-9b1f-6d1e4e3f70f6'; // Fixed starting char

    await queryInterface.bulkInsert('difficulty_levels', [
      { id: diffEasy, name: 'EASY', level: 1, xp_reward: 50, color: 'green', updated_at: new Date() },
      { id: diffMedium, name: 'MEDIUM', level: 2, xp_reward: 100, color: 'yellow', updated_at: new Date() },
      { id: diffHard, name: 'HARD', level: 3, xp_reward: 200, color: 'red', updated_at: new Date() }
    ]);

    // 3. Categories
    const catArrays = 'c8e36e1a-4a1d-4f1e-9b1a-6d1e4e3a70f7';
    await queryInterface.bulkInsert('categories', [
      { id: catArrays, name: 'Arrays & Hashing', slug: 'arrays-hashing', description: 'Challenges related to arrays, lists, and hash maps.', created_at: new Date(), updated_at: new Date() }
    ]);

    // 4. Admin User
    const adminId = 'a8e36e1b-4b1d-4f1e-9b1b-6d1e4e3b70f8';
    await queryInterface.bulkInsert('users', [{
      id: adminId,
      email: 'admin@codespawn.com',
      username: 'admin',
      password_hash: '$2a$10$76.m1vY.M.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N.N',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    await queryInterface.bulkInsert('user_profiles', [{
      user_id: adminId,
      total_xp: 0,
      level: 1,
      updated_at: new Date()
    }]);

    // 5. Sample Problem: Two Sum
    const probTwoSum = 'b8e36e1c-4c1d-4f1e-9b1c-6d1e4e3c70f9'; // Fixed starting char
    await queryInterface.bulkInsert('problems', [{
      id: probTwoSum,
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
      difficulty_id: diffEasy,
      category_id: catArrays,
      language_id: langCSharp,
      xp_reward: 100,
      boilerplate_code: 'public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}',
      created_by: adminId,
      is_published: true,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // 6. Test Cases
    await queryInterface.bulkInsert('test_cases', [
      { id: 'd8e36e1d-4d1d-4f1e-9b1d-6d1e4e3d7010', problem_id: probTwoSum, input: '[2,7,11,15], 9', expected_output: '[0,1]', is_hidden: false, created_at: new Date(), updated_at: new Date() },
      { id: 'f8e36e1e-4e1d-4f1e-9b1e-6d1e4e3e7011', problem_id: probTwoSum, input: '[3,2,4], 6', expected_output: '[1,2]', is_hidden: false, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('test_cases', null, {});
    await queryInterface.bulkDelete('problems', null, {});
    await queryInterface.bulkDelete('user_profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('difficulty_levels', null, {});
    await queryInterface.bulkDelete('languages', null, {});
  }
};

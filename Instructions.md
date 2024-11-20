# Backend Engineer Take-home Assignment

**Expectations**

The goal of this assignment is to help us understand your approach to problem-solving, both code and a README to document the architecture. We know you are busy and appreciate you working on this assignment for us!

We expect you to spend 6 hours on the assignment, and state the time spent in your README. It’s OK to split the time into many chunks -- whatever works best for your schedule or working style.

We expect the implementation to be functional for the features you consider in-scope. We do not expect the code to be deployed on a live server. We will do our best to run your code from the local development instructions but understand that there may be environmental differences.

You may not have time to submit a solution that is completely polished or production-ready, and that is fine. And while the quality of your code is crucial, we want to emphasize that the accompanying README is just as important to us. Use your best judgment to work on what you think is most important, and be sure to explain any TODO's/assumptions/tradeoffs in the README.

**Implementation**

The project is to create a service for current and daily cryptocurrency prices.

Requirements for your service:

1. The      service will query crypto price data from [www.coingecko.com](http://www.coingecko.com) every 1 minute and serve from what you've collected.

2. 1. Please create a free "Demo" account with <https://www.coingecko.com/en/api> and <https://www.coingecko.com/en/api/pricing> and <https://www.coingecko.com/en/developers/dashboard> (will require creating both a User-Account and a       “CoinGecko API Demo Account (Beta)”)
   2. If you have trouble setting up an account, let us know and       we can provide an API key, but it might be rate-limited.
   3. Use APIs such as <https://docs.coingecko.com/v3.0.1/reference/simple-price> (or any other documented APIs) to request and then store       collected data points.

3. The      service will have a REST or GraphQL API to enable the following queries      (no user interface is required):

4. 1. Get the current price for a given pair (e.g. BTC/USD       price)

   2. Get the collected prices in the last 24 hours for a given       pair to display in a chart (per-minute data points, aligned with the       per-minute collection frequency)

   3. The API should allow the application to present the selected pair’s **volatility       rank**. The volatility rank of the pair helps the user       understand how volatile the price is for one pair as compared to other       pairs. To calculate the volatility rank, calculate the standard deviation       of prices over the last 24 hours for each pair, and return the position       of the pair in the descending ordered list of standard deviations. For       example, consider the following standard deviations for these pairs:

   4. - stddev(ethbtc) = 2.4
      - stddev(bntbtc) = 9.3
      - stddev(etceur) = 5.5

   5. The rank for each pair would be the following:

   6. - rank(ethbtc) = 3
      - rank(bntbtc) = 1
      - rank(etceur) = 2

   7. Note: For this example, there are only 3 pairs, but you’ll       be tracking many more pairs than this.

Please use Python or Java and feel free to take advantage of any framework, AWS service or library you deem fit.

The key is to build a very simple version, and document concrete suggestions on how to make it production ready and scalable.

**README**

A clear and detailed README helps us understand your thought process towards the problem, approach to problem-solving, and how you structure your work. Please spend time to include:

- How      to run and test the service (we expect you have been running it during      development. We will attempt to run it, but we also understand that there      may be some environmental differences.)

- Architecture:      Your approach and rationale for design/architecture decisions

- Scalability:

- - what would you change if you needed to track many other       metrics or support every exchange and pair available?
  - what if you needed to sample them more frequently?
  - what if you had many users accessing your dashboard to       view metrics?

- Assumptions      you made during development; any known issues or limitations

- Testing:      how would you extend testing for an application of this kind (beyond what      you implemented)?

- Next      Steps: additions to make the project production-ready, and any potential      enhancements

- Use      of coding assistant tools (see below)

- Time      spent on the assignment

-  

-  

Putting effort into your README shows attention to detail and helps us assess your work more comprehensively. We look forward to seeing your project!

**Coding Assistant Tools and LLMs**

We encourage you to use a development workflow that represents your typical setup; simultaneously we discourage over-use of LLMs and coding assistants to generate your code or README for this exercise. This is an artificial exercise from scratch, and LLMs for software development are quite good at “the basics”. We want to assess your ability to get things done at the frontier-of-complexity, and your ability to explain your engineering reasoning in writing – not using a coding assistant or using it less might showcase your abilities to us better.

That said, “your typical setup” and “discouraging the over-use of LLMs and coding assistants” may be in conflict. Above all, describe to us, in your README, your use, with statements such as:

1. I      typically use ChatGPT or other LLM assistants to answer questions about      software, as a “better than Google and Stack Overflow” search tool. I am      doing the same during this exercise.
2. I      typically use an integrated coding assistant (e.g. Copilot) to      auto-complete code, as I’m typing it. I find it speeds things along and      usually gets it right. I check its work, and am doing the same as I code      this exercise.
3. I      typically give an integrated coding assistant a natural language software      specification for a whole file, class, or component, and translate that      into code. I check its work, and am doing the same for coding this      exercise.
4. I      typically use an integrated coding assistant to research and recommend      software architecture, given a natural-language explanation of a problem.      It might help me with multi-file project layout, database selection, or      other approaches. I like its suggestions, and am doing the same for this      exercise.
5. I      typically use an LLM assistant to edit and revise my written work. I am      doing the same for my README.
6. I      typically use an LLM assistant to generate structured communication from      an early stage of writing. I am doing the same for my README.


 Or:

1. Any      of the above, instead with a statement of how you are using less of an LLM      than you normally would, for the purposes of this exercise, to demonstrate      your personal abilities more clearly.

**Sharing the code**

Please create a private GitHub repository, and once you are ready, let us know so we can tell you who to invite to review it.

 

**Quan MacFarland**

Senior Recruiter

[**www.montecarlodata.com**](http://www.montecarlodata.com/) | [Join the MC Team!](https://www.linkedin.com/company/monte-carlo-data/life/about-us/?viewAsMember=true)

[Linkedin](https://www.linkedin.com/in/quanmacfarland/)
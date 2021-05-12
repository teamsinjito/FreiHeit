export const sqlText = [
  {
    name: 'uR',
    query: 'select * from users where auth_id = $1',
    table: 'Users',
  },
  {
    name: 'rR',
    query: `select 
    rm.id,
    rm.pay_flg as payflg,
    rm.value as pay,
    s.name as subject,
    sg.name as subject_group,
    rm.register_date as day,
    c.name as client_or_cost_name,
    rm.note,
    to_char(rm.register_date,'YYYYMM') as month
    from records_managements as rm 
    inner join users as u on rm.user_id = u.id
    left join subjects as s on rm.subject_id = s.id
    left join subjects_groups as sg on sg.id = s.group_id
    left join clients_and_costs as c on rm.client_or_cost_id = c.id
    where u.mail = 'test@email.com'
    order by rm.register_date desc;`,
    table: 'RecordsManagement',
  },
  {
    name: 'clR',
    query: 'select * from Clients',
    table: 'Clients',
  },
  {
    name: 'coR',
    query: 'select * from Costs',
    table: 'Costs',
  },
  {
    name: 'sR',
    query: 'select * from Subjects',
    table: 'Subjects',
  },
  {
    name: 'sgR',
    query: 'select * from SubjectsGroup',
    table: 'SubjectsGroup',
  },
]

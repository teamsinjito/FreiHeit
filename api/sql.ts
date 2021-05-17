export const sql = {
  userInfo: {
    query: 'select id,office from users where auth_id = $1',
  },
  userRecordsManagement: {
    query: `select 
    rm.id,
    rm.pay_flg as payflg,
    rm.value as pay,
    s.name as subject,
    sg.name as subject_group,
    to_char(rm.register_date,'YYYY年MM月DD日') as day,
    c.name as client_or_cost_name,
    rm.note,
    to_char(rm.register_date,'YYYYMM') as month
    from records_managements as rm 
    inner join users as u on rm.user_id = u.id
    left join subjects as s on rm.subject_id = s.id
    left join subjects_groups as sg on sg.id = s.group_id
    left join clients_and_costs as c on rm.client_or_cost_id = c.id
    where u.id = $1 and rm.register_date BETWEEN $2 AND $3
    order by rm.register_date desc`,
  },
  subjectsInfo: {
    query:
      'select s.id,s.name,sg.name as groupname,s.require_flg as requireflg,s.sort_id as sortid from subjects s inner join subjects_groups sg on sg.id = s.group_id order by s.sort_id;',
  },
  clientsAndCostsInfo: {
    query:
      'select id,name,item_flg from clients_and_costs where user_id = $1 ;',
  },
  tabsInfo: {
    query: 'select tab,content from tabs_info order by tab;',
  },
  insertRecordsManagement: {
    query: `insert into records_managements(
      id,
      user_id,
      pay_flg,
      value,
      subject_id,
      register_date,
      client_or_cost_id,
      note
    ) 
    values($1,$2,$3,$4,$5,$6,$7,$8);`,
  },
}

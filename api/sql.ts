export const sql = {
  defaultWorkInfo: {
    query: `select id,name,last_select_time as last from works where uid = $1 order by last_select_time desc LIMIT 1`,
  },
  updateWorkLastTime: {
    query: 'update works set last_select_time = $1 where id = $2 ;',
  },
  insertWork: {
    query: 'insert into works(id,uid,name) values($1,$2,$3);',
  },
  updateWork: {
    query: 'update works set name = $1 where id = $2 ;',
  },
  deleteWork: {
    query: 'delete from works where id = $1 ;',
  },
  workInfo: {
    query:
      'select id,name from works where uid = $1 order by last_select_time desc',
  },
  userRecordsManagement: {
    query: `select 
    rm.id,
    rm.work_id as wid,
    rm.value as pay,
    rm.subject_id as sid,
    to_char(rm.register_date::timestamp with time zone, 'YYYY-MM-DD'::text) as day,
    rm.client_or_cost_id as cid,
    rm.note
    from records_managements as rm 
    inner join works as w on rm.work_id = w.id
    where w.id = $1 and rm.register_date BETWEEN $2 AND $3
    order by rm.register_date desc`,
  },
  subjectsInfo: {
    query:
      'select s.id,s.name,sg.name as groupname,s.require_flg as requireflg,s.sort_id as sortid from subjects s inner join subjects_groups sg on sg.id = s.group_id order by s.sort_id;',
  },
  clientsAndCostsInfo: {
    query: `select id,name,item_flg as iflg from clients_and_costs where work_id = $1 ;`,
  },
  tabsInfo: {
    query: 'select tab,content from tabs_info order by tab;',
  },
  insertRecordsManagement: {
    query: `insert into records_managements(
      id,
      work_id,
      value,
      subject_id,
      register_date,
      client_or_cost_id,
      note
    ) 
    values($1,$2,$3,$4,$5,$6,$7);`,
  },

  updateRecordManagement: {
    query: `update records_managements set 
              value = $1,
              subject_id = $2,
              register_date = $3,
              client_or_cost_id = $4,
              note = $5
            where id = $6 ;`,
  },

  deleteRecordManagement: {
    query: 'delete from records_managements where id = $1 ;',
  },

  insertClientCost: {
    query: `insert into clients_and_costs(
      id,
      name,
      work_id,
      item_flg
    ) 
    values($1,$2,$3,$4);`,
  },
  updateClientCost: {
    query: 'update clients_and_costs set name = $1 where id = $2 ;',
  },
  deleteClientCost: {
    query: 'delete from clients_and_costs where id = $1 ;',
  },
}
